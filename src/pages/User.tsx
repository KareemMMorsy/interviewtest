import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function User() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    avatar: '',
  });

  // Fetch user details
  const { isLoading, isError } = useQuery({
    queryKey: [`User-edit/${id}`],
    queryFn: () =>
      fetch(`https://reqres.in/api/users/${id}`)
        .then((res) => res.json())
        .then((data) => {
          const userData = data.data; // Correctly access the `data` object
          setFormData({
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
            avatar: userData.avatar,
          });
          return userData;
        }),
  });

  // Update user details
  const { mutate, isPending, isError: isMutationError, isSuccess } = useMutation({
    mutationFn: (updatedUser) =>
      fetch(`https://reqres.in/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      }).then((res) => res.json()),
    onSuccess: () => {
      alert('User updated successfully!');
    },
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({
      id,
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user data.</div>;

  return (
    <>
      <div className="container flex flex-col items-center px-4">
        <div className="avatar bg-black flex justify-center w-32 rounded-full overflow-hidden">
          <img src={formData.avatar} alt="User Avatar" />
        </div>
        <form className="details mt-4" onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="border rounded p-2 w-full mb-2"
          />
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="border rounded p-2 w-full mb-2"
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="border rounded p-2 w-full mb-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
          >
            {isPending ? 'Updating...' : 'Update'}
          </button>
        </form>
        <button
          className="mt-4 bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
          onClick={() => navigate('/')}
        >
          Back
        </button>
        {isSuccess && <p className="text-green-500 mt-2">Update Successful!</p>}
        {isMutationError && <p className="text-red-500 mt-2">Update Failed!</p>}
      </div>
    </>
  );
}

export default User;
