import { FormField } from "@/types/form";
import { fetchData } from "@/utils/fetchData";

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
    id: "number",
    label: "Nomor Ruangan",
    type: "number",
    placeholder: "Masukkan nomor ruangan",
    required: true,
  },
  {
    id: "is_practice_room",
    label: "Jenis Ruangan",
    type: "checkbox",
    required: true,
  },
  {
    id: "major_id",
    label: "Jurusan",
    type: "select",
    options: async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
      const { data } = await fetchData(`${API_URL}/majors/list`, {
        requireAuth: true
      });
      return (data as Array<{ id: string; name: string }>).map((major) => ({
        value: major.id,
        label: major.name
      }));
    },
    required: false,
  }
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

export const UPDATE_GENERATION_FIELDS: FormField[] = [
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
  {
    id: "is_graduated",
    label: "Lulus",
    type: "checkbox",
    required: true
  }
];

export const JURUSAN_FIELDS: FormField[] = [
  {
    id: "name",
    label: "Nama Jurusan",
    type: "text",
    placeholder: "Masukkan nama jurusan",
    required: true,
  },
  {
    id: "abbreviation",
    label: "Singkatan",
    type: "text",
    placeholder: "Masukkan singkatan jurusan",
    required: true,
  },
];

export const MAPEL_FIELDS: FormField[] = [
  {
    id: "name",
    label: "Nama Mapel",
    type: "text",
    placeholder: "Masukkan nama mapel",
    required: true,
  },
  {
    id: "abbreviation",
    label: "Singkatan",
    type: "text",
    placeholder: "Masukkan singkatan mapel",
    required: true,
  },
  {
    id: "is_vocational_subject",
    label: "Mapel Kejuruan",
    type: "checkbox",
    required: true
  },
  {
    id: "major_id",
    label: "Jurusan",
    type: "select",
    options: async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
      const { data } = await fetchData(`${API_URL}/majors/list`, {
        requireAuth: true
      });

      return (data as Array<{ id: string; name: string }>).map((major) => ({
        value: major.id,
        label: major.name
      }));
    },
    required: false
  }
];