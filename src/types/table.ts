export type SiswaType = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "student" | "teacher";
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
  class?: string;
  studentId?: string;
  phoneNumber?: string;
  gender?: string;
};

export type GuruType = {
  id: number;
  name: string;
  nip: string;
  mapel: string;
  gender: string;
  status: string;
};

export type RuanganType = {
  id: number;
  name: string;
  capacity: number;
  type: string;
  status: string;
};

export interface Generation {
  id: string;
  number: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  is_graduated: boolean;
}

export type SortingState = {
  id: string;
  desc: boolean;
}[];
