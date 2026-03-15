import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";

interface ProductForm {
  name: string;
  sku: string;
  category: string;
  stockQuantity: string;
  unitPrice: string;
}

const empty: ProductForm = {
  name: "",
  sku: "",
  category: "",
  stockQuantity: "",
  unitPrice: "",
};

export default function InventoryAdmin() {
  const { actor, isFetching } = useActor();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(empty);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => (actor ? actor.getProducts() : []),
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: async (f: ProductForm) => {
      if (!actor) throw new Error("No actor");
      return actor.addProduct(
        f.name,
        f.sku,
        f.category,
        BigInt(f.stockQuantity),
        Number.parseFloat(f.unitPrice),
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Product added");
      setDialogOpen(false);
    },
    onError: () => toast.error("Failed to add product"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, f }: { id: bigint; f: ProductForm }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProduct(
        id,
        f.name,
        f.sku,
        f.category,
        BigInt(f.stockQuantity),
        Number.parseFloat(f.unitPrice),
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Product updated");
      setDialogOpen(false);
    },
    onError: () => toast.error("Failed to update product"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Product deleted");
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const openAdd = () => {
    setEditProduct(null);
    setForm(empty);
    setDialogOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      sku: p.sku,
      category: p.category,
      stockQuantity: p.stockQuantity.toString(),
      unitPrice: p.unitPrice.toString(),
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editProduct) {
      updateMutation.mutate({ id: editProduct.id, f: form });
    } else {
      addMutation.mutate(form);
    }
  };

  const isPending = addMutation.isPending || updateMutation.isPending;

  return (
    <div data-ocid="inventory.section">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[oklch(0.55_0.02_245)]">
          Manage product stock and pricing
        </p>
        <Button
          size="sm"
          onClick={openAdd}
          data-ocid="inventory.add_product.button"
          className="admin-btn-primary"
        >
          <Plus size={14} className="mr-1" /> Add Product
        </Button>
      </div>

      <div className="admin-table-card overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-2" data-ocid="inventory.loading_state">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (products ?? []).length === 0 ? (
          <div
            className="p-10 text-center text-sm text-[oklch(0.6_0.02_245)]"
            data-ocid="inventory.empty_state"
          >
            No products found
          </div>
        ) : (
          <Table data-ocid="inventory.table">
            <TableHeader>
              <TableRow className="bg-[oklch(0.97_0.005_245)]">
                <TableHead className="text-xs">SKU</TableHead>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Category</TableHead>
                <TableHead className="text-xs text-right">Stock</TableHead>
                <TableHead className="text-xs text-right">Unit Price</TableHead>
                <TableHead className="text-xs text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(products ?? []).map((p, idx) => (
                <TableRow
                  key={p.id.toString()}
                  data-ocid={`inventory.item.${idx + 1}`}
                >
                  <TableCell className="text-xs font-mono text-[oklch(0.5_0.02_245)]">
                    {p.sku}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {p.name}
                  </TableCell>
                  <TableCell className="text-xs">{p.category}</TableCell>
                  <TableCell className="text-xs text-right">
                    <span
                      className={`font-semibold ${Number(p.stockQuantity) < 10 ? "text-red-600" : "text-[oklch(0.35_0.12_145)]"}`}
                    >
                      {p.stockQuantity.toString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-right font-medium">
                    ₹{p.unitPrice.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEdit(p)}
                        data-ocid={`inventory.edit_button.${idx + 1}`}
                        className="h-7 w-7"
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(p.id)}
                        data-ocid={`inventory.delete_button.${idx + 1}`}
                        className="h-7 w-7 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md" data-ocid="inventory.dialog">
          <DialogHeader>
            <DialogTitle>
              {editProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                  className="mt-1 h-8 text-sm"
                  data-ocid="inventory.name.input"
                />
              </div>
              <div>
                <Label className="text-xs">SKU</Label>
                <Input
                  value={form.sku}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sku: e.target.value }))
                  }
                  required
                  className="mt-1 h-8 text-sm"
                  data-ocid="inventory.sku.input"
                />
              </div>
              <div>
                <Label className="text-xs">Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  required
                  className="mt-1 h-8 text-sm"
                  data-ocid="inventory.category.input"
                />
              </div>
              <div>
                <Label className="text-xs">Stock Qty</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.stockQuantity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, stockQuantity: e.target.value }))
                  }
                  required
                  className="mt-1 h-8 text-sm"
                  data-ocid="inventory.stock.input"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Unit Price (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.unitPrice}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, unitPrice: e.target.value }))
                  }
                  required
                  className="mt-1 h-8 text-sm"
                  data-ocid="inventory.price.input"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(false)}
                data-ocid="inventory.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="admin-btn-primary"
                data-ocid="inventory.save_button"
              >
                {isPending ? "Saving..." : editProduct ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
