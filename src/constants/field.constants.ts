import { FormField } from "@/types/form";

export const SISWA_FIELDS: FormField[] = [
  {
    id: "name",
    label: "Nama",
    type: "text",
    placeholder: "Masukkan nama lengkap siswa",
    required: true,
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "Masukkan email siswa",
    required: true,
  },
  {
    id: "studentId",
    label: "NIS",
    type: "text",
    placeholder: "Masukkan Nomor Induk Siswa",
    required: true,
  },
  {
    id: "class",
    label: "Kelas",
    type: "select",
    options: [
      { value: "X", label: "Kelas X" },
      { value: "XI", label: "Kelas XI" },
      { value: "XII", label: "Kelas XII" },
    ],
    required: true,
  },
  {
    id: "gender",
    label: "Jenis Kelamin",
    type: "select",
    options: [
      { value: "L", label: "Laki-laki" },
      { value: "P", label: "Perempuan" },
    ],
    required: true,
  },
  {
    id: "phoneNumber",
    label: "Nomor Telepon",
    type: "tel",
    placeholder: "Masukkan nomor telepon",
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Aktif" },
      { value: "inactive", label: "Tidak Aktif" },
    ],
    required: true,
  },
];

export const GURU_FIELDS: FormField[] = [
  {
    id: "name",
    label: "Nama",
    type: "text",
    placeholder: "Masukkan nama",
    required: true,
  },
  {
    id: "nip",
    label: "NIP",
    type: "text",
    placeholder: "Masukkan NIP",
    required: true,
  },
  {
    id: "gender",
    label: "Jenis Kelamin",
    type: "select",
    options: [
      { value: "L", label: "Laki-laki" },
      { value: "P", label: "Perempuan" },
    ],
    required: true,
  },
  {
    id: "mapel",
    label: "Mata Pelajaran",
    type: "text",
    placeholder: "Masukkan mata pelajaran",
    required: true,
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Aktif" },
      { value: "inactive", label: "Tidak Aktif" },
    ],
    required: true,
  },
];

export const RUANGAN_FIELDS: FormField[] = [
  {
    id: "name",
    label: "Nama Ruangan",
    type: "text",
    placeholder: "Masukkan nama ruangan",
    required: true,
  },
  {
    id: "capacity",
    label: "Kapasitas",
    type: "number",
    placeholder: "Masukkan kapasitas ruangan",
    required: true,
  },
  {
    id: "type",
    label: "Tipe Ruangan",
    type: "select",
    options: [
      { value: "kelas", label: "Ruang Kelas" },
      { value: "lab", label: "Laboratorium" },
      { value: "other", label: "Lainnya" },
    ],
    required: true,
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "available", label: "Tersedia" },
      { value: "maintenance", label: "Dalam Perbaikan" },
      { value: "used", label: "Sedang Digunakan" },
    ],
    required: true,
  },
];

export const GENERATION_FIELDS: FormField[] = [
  {
    id: "number",
    label: "Nomor",
    type: "number",
    required: true,
  },
  {
    id: "start_date",
    label: "Tanggal Mulai",
    type: "date",
    required: true,
  },
  {
    id: "end_date",
    label: "Tanggal Selesai",
    type: "date",
    required: true,
  },
];
