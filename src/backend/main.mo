import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

import Time "mo:core/Time";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  //////////////////////
  // Type definitions //
  //////////////////////

  public type Product = {
    id : Nat;
    name : Text;
    sku : Text;
    category : Text;
    stockQuantity : Nat;
    unitPrice : Float;
    lastUpdated : Time.Time;
  };

  public type OrderItem = {
    productName : Text;
    quantity : Nat;
    unitPrice : Float;
  };

  public type Order = {
    id : Nat;
    agentMobile : Text;
    agentName : Text;
    customerName : Text;
    customerMobile : Text;
    items : [OrderItem];
    totalAmount : Float;
    status : {
      #pending;
      #confirmed;
      #dispatched;
      #delivered;
    };
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type SalesProduct = {
    productName : Text;
    quantity : Nat;
    amount : Float;
  };

  public type SalesRecord = {
    id : Nat;
    agentMobile : Text;
    agentName : Text;
    customerName : Text;
    date : Time.Time;
    products : [SalesProduct];
    totalAmount : Float;
    paymentMode : Text;
  };

  public type ServiceRequest = {
    id : Nat;
    customerName : Text;
    customerMobile : Text;
    description : Text;
    assignedAgentMobile : Text;
    assignedAgentName : Text;
    status : {
      #open;
      #in_progress;
      #closed;
    };
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type AgentLocation = {
    agentMobile : Text;
    agentName : Text;
    territory : Text;
    lastCheckIn : Time.Time;
    locationName : Text;
    isActive : Bool;
  };

  ///////////////////////////
  // Persistent state vars //
  ///////////////////////////

  var nextProductId = 1;
  var nextOrderId = 1;
  var nextSalesRecordId = 1;
  var nextServiceRequestId = 1;

  let productsMap = Map.empty<Nat, Product>();
  let ordersMap = Map.empty<Nat, Order>();
  let salesRecordsMap = Map.empty<Nat, SalesRecord>();
  let serviceRequestsMap = Map.empty<Nat, ServiceRequest>();
  let agentLocationsMap = Map.empty<Text, AgentLocation>();

  ////////////////////////////////////////////
  // Inventory part of the actor interface. //
  ////////////////////////////////////////////

  public shared ({ caller }) func addProduct(name : Text, sku : Text, category : Text, stockQuantity : Nat, unitPrice : Float) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let product : Product = {
      id = nextProductId;
      name;
      sku;
      category;
      stockQuantity;
      unitPrice;
      lastUpdated = Time.now();
    };
    productsMap.add(nextProductId, product);

    nextProductId += 1;
    product;
  };

  public shared ({ caller }) func updateProduct(id : Nat, name : Text, sku : Text, category : Text, stockQuantity : Nat, unitPrice : Float) : async ?Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (productsMap.get(id)) {
      case (null) { null };
      case (?existingProduct) {
        let updatedProduct : Product = {
          existingProduct with
          name;
          sku;
          category;
          stockQuantity;
          unitPrice;
          lastUpdated = Time.now();
        };
        productsMap.add(id, updatedProduct);
        ?updatedProduct;
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    let existed = productsMap.containsKey(id);
    productsMap.remove(id);
    existed;
  };

  public query ({ caller }) func getProducts() : async [Product] {
    productsMap.values().toArray();
  };

  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    productsMap.get(id);
  };

  /////////////////////////////////////////
  // Orders part of the actor interface. //
  /////////////////////////////////////////

  public shared ({ caller }) func createOrder(agentMobile : Text, agentName : Text, customerName : Text, customerMobile : Text, items : [OrderItem], totalAmount : Float) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };

    let order : Order = {
      id = nextOrderId;
      agentMobile;
      agentName;
      customerName;
      customerMobile;
      items;
      totalAmount;
      status = #pending;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    ordersMap.add(nextOrderId, order);
    nextOrderId += 1;
    order;
  };

  public shared ({ caller }) func updateOrderStatus(id : Nat, status : { #pending; #confirmed; #dispatched; #delivered }) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (ordersMap.get(id)) {
      case (null) { null };
      case (?existingOrder) {
        let updatedOrder : Order = {
          existingOrder with
          status;
          updatedAt = Time.now();
        };
        ordersMap.add(id, updatedOrder);
        ?updatedOrder;
      };
    };
  };

  public query ({ caller }) func getOrders() : async [Order] {
    ordersMap.values().toArray();
  };

  public query ({ caller }) func getOrder(id : Nat) : async ?Order {
    ordersMap.get(id);
  };

  public query ({ caller }) func getOrdersByAgent(agentMobile : Text) : async [Order] {
    ordersMap.values().toArray().filter(func(o) { o.agentMobile == agentMobile });
  };

  public query ({ caller }) func getOrdersByStatus(status : { #pending; #confirmed; #dispatched; #delivered }) : async [Order] {
    ordersMap.values().toArray().filter(func(o) { o.status == status });
  };

  public shared ({ caller }) func cancelOrder(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel orders");
    };

    let existed = ordersMap.containsKey(id);
    ordersMap.remove(id);
    existed;
  };

  public query ({ caller }) func getTotalOrderCount() : async Nat {
    ordersMap.size();
  };

  public query ({ caller }) func getOrderStatsByStatus() : async (Nat, Nat, Nat, Nat) {
    var pending = 0;
    var confirmed = 0;
    var dispatched = 0;
    var delivered = 0;

    for ((_, order) in ordersMap.entries()) {
      switch (order.status) {
        case (#pending) { pending += 1 };
        case (#confirmed) { confirmed += 1 };
        case (#dispatched) { dispatched += 1 };
        case (#delivered) { delivered += 1 };
      };
    };

    (pending, confirmed, dispatched, delivered);
  };

  ///////////////////////////////////////////
  // SalesRecords part of the actor interface.
  ///////////////////////////////////////////
  public shared ({ caller }) func addSalesRecord(agentMobile : Text, agentName : Text, customerName : Text, date : Time.Time, products : [SalesProduct], totalAmount : Float, paymentMode : Text) : async SalesRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add sales records");
    };

    let record : SalesRecord = {
      id = nextSalesRecordId;
      agentMobile;
      agentName;
      customerName;
      date;
      products;
      totalAmount;
      paymentMode;
    };
    salesRecordsMap.add(nextSalesRecordId, record);
    nextSalesRecordId += 1;
    record;
  };

  public query ({ caller }) func getSalesRecords() : async [SalesRecord] {
    salesRecordsMap.values().toArray();
  };

  public query ({ caller }) func getSalesRecordsByAgent(agentMobile : Text) : async [SalesRecord] {
    salesRecordsMap.values().toArray().filter(func(r) { r.agentMobile == agentMobile });
  };

  public query ({ caller }) func getSalesRecordsByDateRange(startDate : Time.Time, endDate : Time.Time) : async [SalesRecord] {
    salesRecordsMap.values().toArray().filter(
      func(r) { r.date >= startDate and r.date <= endDate }
    );
  };

  public query ({ caller }) func getSalesSummaryByProduct() : async [(Text, Nat, Float)] {
    let productsMap = Map.empty<Text, (Nat, Float)>();

    for ((_, record) in salesRecordsMap.entries()) {
      for (product in record.products.values()) {
        switch (productsMap.get(product.productName)) {
          case (null) {
            productsMap.add(product.productName, (product.quantity, product.amount));
          };
          case (?existing) {
            let (qty, amt) = existing;
            productsMap.add(product.productName, (qty + product.quantity, amt + product.amount));
          };
        };
      };
    };

    productsMap.entries().toArray().map(
      func((name, (qty, amt))) { (name, qty, amt) }
    );
  };

  public query ({ caller }) func getSalesRecordStats() : async (Nat, Float) {
    var totalSales = 0.0;

    for ((_, record) in salesRecordsMap.entries()) {
      totalSales += record.totalAmount;
    };

    (salesRecordsMap.size(), totalSales);
  };

  ////////////////////////////////////////////
  // ServiceRequests part of the actor interface.
  ////////////////////////////////////////////
  public shared ({ caller }) func createServiceRequest(customerName : Text, customerMobile : Text, description : Text, assignedAgentMobile : Text, assignedAgentName : Text) : async ServiceRequest {
    let request : ServiceRequest = {
      id = nextServiceRequestId;
      customerName;
      customerMobile;
      description;
      assignedAgentMobile;
      assignedAgentName;
      status = #open;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    serviceRequestsMap.add(nextServiceRequestId, request);
    nextServiceRequestId += 1;
    request;
  };

  public shared ({ caller }) func updateServiceRequest(id : Nat, status : { #open; #in_progress; #closed }) : async ?ServiceRequest {
    switch (serviceRequestsMap.get(id)) {
      case (null) { null };
      case (?existingRequest) {
        let updatedRequest : ServiceRequest = {
          existingRequest with
          status;
          updatedAt = Time.now();
        };
        serviceRequestsMap.add(id, updatedRequest);
        ?updatedRequest;
      };
    };
  };

  public query ({ caller }) func getServiceRequests() : async [ServiceRequest] {
    serviceRequestsMap.values().toArray();
  };

  public query ({ caller }) func getServiceRequest(id : Nat) : async ?ServiceRequest {
    serviceRequestsMap.get(id);
  };

  ////////////////////////////////////////////
  // AgentLocations part of the actor interface.
  ////////////////////////////////////////////
  public shared ({ caller }) func updateAgentLocation(agentMobile : Text, agentName : Text, territory : Text, locationName : Text, isActive : Bool) : async AgentLocation {
    let location : AgentLocation = {
      agentMobile;
      agentName;
      territory;
      lastCheckIn = Time.now();
      locationName;
      isActive;
    };
    agentLocationsMap.add(agentMobile, location);
    location;
  };

  public query ({ caller }) func getAgentLocations() : async [AgentLocation] {
    agentLocationsMap.values().toArray();
  };

  public query ({ caller }) func getAgentLocation(agentMobile : Text) : async ?AgentLocation {
    agentLocationsMap.get(agentMobile);
  };

  //////////////////////////
  // Dashboard statistics //
  //////////////////////////
  public query ({ caller }) func getTotalOrders() : async Nat {
    ordersMap.size();
  };

  public query ({ caller }) func getOpenServiceRequests() : async [ServiceRequest] {
    serviceRequestsMap.values().toArray().filter(func(r) { r.status == #open });
  };

  public query ({ caller }) func getActiveAgents() : async [AgentLocation] {
    agentLocationsMap.values().toArray().filter(func(a) { a.isActive });
  };

  public query ({ caller }) func getTotalInventoryValue() : async Float {
    var total : Float = 0.0;
    for ((_, product) in productsMap.entries()) {
      total += product.stockQuantity.toFloat() * product.unitPrice;
    };
    total;
  };
};
