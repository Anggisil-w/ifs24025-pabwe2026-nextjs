import Swal from "sweetalert2";

export const showSuccessDialog = (message: string) => {
  return Swal.fire({ icon: "success", title: "Berhasil", text: message });
};

export const showErrorDialog = (message: string) => {
  return Swal.fire({ icon: "error", title: "Gagal", text: message });
};

export const showWarningDialog = (message: string) => {
  return Swal.fire({ icon: "warning", title: "Peringatan", text: message });
};

export const showConfirmDialog = async (message: string): Promise<boolean> => {
  const result = await Swal.fire({
    title: "Konfirmasi",
    text: message,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
  });
  return result.isConfirmed;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};