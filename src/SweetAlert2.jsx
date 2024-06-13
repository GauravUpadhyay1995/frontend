import Swal from 'sweetalert2';

const SweetAlert2 = (data) => {
  const toastMixin = Swal.mixin({
    toast: true,
    icon: data.type,
    title: 'General Title',
    animation: false,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  const showAlert = async () => {
    toastMixin.fire({
      animation: true,
      title: data.title
    });
  };

  const confirmAlert = () => {
    return Swal.fire({
      title: data.title,
      text: data.text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, do it!"
    });
  };

  if (data.type === "confirm") {
    return confirmAlert();
  } else {
    showAlert();
    return Promise.resolve(); // Return a resolved promise for other types
  }
};

export default SweetAlert2;
