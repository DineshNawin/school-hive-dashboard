"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";

type Category = {
  id: number;
  name: string;
  description: string;
  roles: string[];
};

export default function StaffCategoryManager() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Teaching Staff", description: "Handles academic instruction", roles: ["Math Teacher", "Science Teacher"] },
    { id: 2, name: "Administrative", description: "Handles school admin tasks", roles: ["Secretary"] },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId) || null;

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [roleInput, setRoleInput] = useState("");

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setDescription(category.description);
    } else {
      setEditingCategory(null);
      setName("");
      setDescription("");
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, name, description } : cat
        )
      );
    } else {
      const newCategory: Category = {
        id: Date.now(),
        name,
        description,
        roles: [],
      };
      setCategories((prev) => [...prev, newCategory]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const openRolesSheet = (category: Category) => {
    setSelectedCategoryId(category.id);
    setRoleInput("");
    setSheetOpen(true);
  };

  const addRoleToCategory = () => {
    if (!roleInput.trim()) {
      toast.error("Role cannot be empty");
      return;
    }
    if (!selectedCategory) return;

    if (selectedCategory.roles.includes(roleInput.trim())) {
      toast.warning("Role already exists in this category");
      return;
    }

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === selectedCategory.id
          ? { ...cat, roles: [...cat.roles, roleInput.trim()] }
          : cat
      )
    );
    toast.success("Role added");
    setRoleInput("");
  };

  const removeRoleFromCategory = (roleIndex: number) => {
    if (!selectedCategory) return;
    const roleName = selectedCategory.roles[roleIndex];

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === selectedCategory.id
          ? { ...cat, roles: cat.roles.filter((_, idx) => idx !== roleIndex) }
          : cat
      )
    );
    toast.info(`Role removed: ${roleName}`);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Staff Categories</h2>
        <Button onClick={() => handleOpenModal()}>Add Category</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell>{cat.name}</TableCell>
              <TableCell>{cat.description}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="sm" onClick={() => handleOpenModal(cat)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(cat.id)}>Delete</Button>
                <Button variant="ghost" size="sm" onClick={() => openRolesSheet(cat)}>Roles</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Staff Category" : "Create Staff Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="e.g. Support Staff"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Optional description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>{editingCategory ? "Update" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Animated Sheet for Roles */}
        {sheetOpen && (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetContent className="h-full">
                <SheetHeader>
                  <SheetTitle>Manage Roles - {selectedCategory?.name}</SheetTitle>
                </SheetHeader>

                <div className="p-4 space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new role"
                      value={roleInput}
                      onChange={(e) => setRoleInput(e.target.value)}
                    />
                    <Button onClick={addRoleToCategory}>Add</Button>
                  </div>

                  <ul className="list-disc ml-5 space-y-1">
                    {selectedCategory?.roles.map((role, idx) => (
                      <li key={idx} className="flex justify-between items-center">
                        {role}
                        <Button variant="ghost" size="sm" onClick={() => removeRoleFromCategory(idx)}>
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </SheetContent>
            </Sheet>
        )}
    </div>
  );
}
