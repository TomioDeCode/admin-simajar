import { useState } from "react";
import { TableData } from "@/types/tableReus";

export function useDialog<T extends TableData>() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const openAdd = () => {
    setSelectedItem(null);
    setIsOpen(true);
    setIsDeleteDialogOpen(false);
  };

  const openEdit = (item: T) => {
    setSelectedItem(item);
    setIsOpen(true);
    setIsDeleteDialogOpen(false);
  };

  const openDelete = (item: T) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
    setIsOpen(false);
  };

  const close = () => {
    setIsOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  return {
    isOpen,
    isDeleteDialogOpen,
    selectedItem,
    openAdd,
    openEdit,
    openDelete,
    close,
    setIsDeleteDialogOpen,
  };
}
