export interface User {
  gender: 'Female' | 'Male';
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    street: string;
    city: string;
    state: string;
    country: string;
    postcode: string | number;
    timezone: string;
  };
  email: string;
  phone: string;
  cell: string;
  picture: string;
  dob: {
    date: string;
    age: number;
  };
  hobbies: string[];
  details: string;
}