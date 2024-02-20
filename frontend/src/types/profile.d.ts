declare interface Profile {
  id: string;
  username: string;
  email: string;
  name: string;
  birth: string;
  year: number;
  section: string;
  course: string;
  student_number: string;
  phone_number: string;
}

declare interface UserProfile {
  id: string;
  username: string;
  email: string;
  name: string;
  birth: string;
  year: number;
  section: string;
  course: string;
  student_number: string;
  phone_number: string;
  status: string
}

declare interface AdminProfile {
  id: string
  username: string
  email: string
  name: string
  birth: string
  phone_number: string
  roles: string[]
}