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
  id: string;
  created_at: string;
  updated_at: string; 
  number: number;
  is_practice_room: boolean;
  major_id: string | null;
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

export type JurusanType = {
  id: string;
  name: string;
  abbreviation: string;
  created_at: string;
  updated_at: string;
};

export type MapelType = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  abbreviation: string;
  is_vocational_subject: boolean;
  major_id: string | null | undefined;
}

export type SortingState = {
  id: string;
  desc: boolean;
}[];
