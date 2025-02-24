import React from 'react'

function page() {
    return (
      <div>
        <h1>Update Your Profile</h1>
        {/* Form hoặc UI để cập nhật hồ sơ */}
        <form>
          {/* Các input field cho việc cập nhật hồ sơ */}
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <button type="submit">Save Changes</button>
        </form>
      </div>
    );
  }

export default page
