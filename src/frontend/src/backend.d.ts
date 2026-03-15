import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ServiceRequest {
    id: bigint;
    customerName: string;
    status: Variant_closed_in_progress_open;
    assignedAgentName: string;
    assignedAgentMobile: string;
    createdAt: Time;
    customerMobile: string;
    description: string;
    updatedAt: Time;
}
export type Time = bigint;
export interface SalesProduct {
    productName: string;
    quantity: bigint;
    amount: number;
}
export interface OrderItem {
    productName: string;
    quantity: bigint;
    unitPrice: number;
}
export interface SalesRecord {
    id: bigint;
    customerName: string;
    date: Time;
    agentName: string;
    totalAmount: number;
    paymentMode: string;
    agentMobile: string;
    products: Array<SalesProduct>;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: Variant_pending_dispatched_delivered_confirmed;
    createdAt: Time;
    agentName: string;
    customerMobile: string;
    updatedAt: Time;
    totalAmount: number;
    items: Array<OrderItem>;
    agentMobile: string;
}
export interface Product {
    id: bigint;
    sku: string;
    stockQuantity: bigint;
    name: string;
    lastUpdated: Time;
    category: string;
    unitPrice: number;
}
export interface AgentLocation {
    territory: string;
    agentName: string;
    isActive: boolean;
    lastCheckIn: Time;
    agentMobile: string;
    locationName: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_closed_in_progress_open {
    closed = "closed",
    in_progress = "in_progress",
    open = "open"
}
export enum Variant_pending_dispatched_delivered_confirmed {
    pending = "pending",
    dispatched = "dispatched",
    delivered = "delivered",
    confirmed = "confirmed"
}
export interface backendInterface {
    addProduct(name: string, sku: string, category: string, stockQuantity: bigint, unitPrice: number): Promise<Product>;
    addSalesRecord(agentMobile: string, agentName: string, customerName: string, date: Time, products: Array<SalesProduct>, totalAmount: number, paymentMode: string): Promise<SalesRecord>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelOrder(id: bigint): Promise<boolean>;
    createOrder(agentMobile: string, agentName: string, customerName: string, customerMobile: string, items: Array<OrderItem>, totalAmount: number): Promise<Order>;
    createServiceRequest(customerName: string, customerMobile: string, description: string, assignedAgentMobile: string, assignedAgentName: string): Promise<ServiceRequest>;
    deleteProduct(id: bigint): Promise<boolean>;
    getActiveAgents(): Promise<Array<AgentLocation>>;
    getAgentLocation(agentMobile: string): Promise<AgentLocation | null>;
    getAgentLocations(): Promise<Array<AgentLocation>>;
    getCallerUserRole(): Promise<UserRole>;
    getOpenServiceRequests(): Promise<Array<ServiceRequest>>;
    getOrder(id: bigint): Promise<Order | null>;
    getOrderStatsByStatus(): Promise<[bigint, bigint, bigint, bigint]>;
    getOrders(): Promise<Array<Order>>;
    getOrdersByAgent(agentMobile: string): Promise<Array<Order>>;
    getOrdersByStatus(status: Variant_pending_dispatched_delivered_confirmed): Promise<Array<Order>>;
    getProduct(id: bigint): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    getSalesRecordStats(): Promise<[bigint, number]>;
    getSalesRecords(): Promise<Array<SalesRecord>>;
    getSalesRecordsByAgent(agentMobile: string): Promise<Array<SalesRecord>>;
    getSalesRecordsByDateRange(startDate: Time, endDate: Time): Promise<Array<SalesRecord>>;
    getSalesSummaryByProduct(): Promise<Array<[string, bigint, number]>>;
    getServiceRequest(id: bigint): Promise<ServiceRequest | null>;
    getServiceRequests(): Promise<Array<ServiceRequest>>;
    getTotalInventoryValue(): Promise<number>;
    getTotalOrderCount(): Promise<bigint>;
    getTotalOrders(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    updateAgentLocation(agentMobile: string, agentName: string, territory: string, locationName: string, isActive: boolean): Promise<AgentLocation>;
    updateOrderStatus(id: bigint, status: Variant_pending_dispatched_delivered_confirmed): Promise<Order | null>;
    updateProduct(id: bigint, name: string, sku: string, category: string, stockQuantity: bigint, unitPrice: number): Promise<Product | null>;
    updateServiceRequest(id: bigint, status: Variant_closed_in_progress_open): Promise<ServiceRequest | null>;
}
