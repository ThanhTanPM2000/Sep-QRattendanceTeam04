const users = [
  {
    _id: "5b21ca3eeb7f6fbccd471815",
    id: "187pm56678",
    displayName: "Luu Thanh Ha",
    mail: "tan.187pm20569@vanlanguni.vn",
    degree: "Tien si",
    role: "Quan Tri Vien",
    faculty: { _id: "5b21ca3eeb7f6fbccd471818", name: "Cong Nghe Thong Tin" },
  },
  {
    _id: "5b21ca3eeb7f6fbccd471816",
    id: "187pm44332",
    displayName: "Nguyen Huu Xuan",
    mail: "tan.187pm20569@vanlanguni.vn",
    degree: "Tien si",
    role: "Quan Tri Vien",
    faculty: { _id: "5b21ca3eeb7f6fbccd471818", name: "Cong Nghe Thong Tin" },
  },
  {
    _id: "5b21ca3eeb7f6fbccd471817",
    id: "187pm20569",
    displayName: "Nguyen Thanh Tan",
    mail: "tan.187pm20569@vanlanguni.vn",
    degree: "Tien si",
    role: "Quan Tri Vien",
    faculty: { _id: "5b21ca3eeb7f6fbccd471820", name: "Y Duoc" },
  },
  {
    _id: "5b21ca3eeb7f6fbccd471819",
    id: "187pm33221",
    displayName: "Nguyen Van Troi",
    mail: "tan.187pm20569@vanlanguni.vn",
    degree: "Tien si",
    role: "Quan Tri Vien",
    faculty: { _id: "5b21ca3eeb7f6fbccd471814", name: "Quan Tri Kinh Doanh" },
  },
  {
    _id: "5b21ca3eeb7f6fbccd47181a",
    id: "187pm33243",
    displayName: "Ha Minh Tuan",
    mail: "tan.187pm20569@vanlanguni.vn",
    degree: "Tien si",
    role: "Quan Tri Vien",
    faculty: { _id: "5b21ca3eeb7f6fbccd471814", name: "Quan Tri Kinh Doanh" },
  },
  {
    _id: "5b21ca3eeb7f6fbccd47181b",
    id: "187pm20569",
    displayName: "Nguyen Thanh Tan",
    mail: "tan.187pm20569@vanlanguni.vn",
    degree: "Tien si",
    role: "Quan Tri Vien",
    faculty: { _id: "5b21ca3eeb7f6fbccd471814", name: "Quan Tri Kinh Doanh" },
  },
  {
    _id: "5b21ca3eeb7f6fbccd47181e",
    id: "187pm20569",
    displayName: "Nguyen Thanh Tan",
    mail: "tan.187pm20569@vanlanguni.vn",
    degree: "Tien si",
    role: "Quan Tri Vien",
    faculty: { _id: "5b21ca3eeb7f6fbccd471820", name: "Y Duoc" },
  },
  {
    _id: "5b21ca3eeb7f6fbccd47181f",
    id: "187pm20569",
    displayName: "Nguyen Thanh Tan",
    mail: "tan.187pm20569@vanlanguni.vn",
    degree: "Tien si",
    role: "Quan Tri Vien",
    faculty: { _id: "5b21ca3eeb7f6fbccd471820", name: "Y Duoc" },
  },
  {
    _id: "5b21ca3eeb7f6fbccd471821",
    id: "187pm20569",
    displayName: "Nguyen Thanh Tan",
    mail: "tan.187pm20569@vanlanguni.vn",
    degree: "Tien si",
    role: "Quan Tri Vien",
    faculty: { _id: "5b21ca3eeb7f6fbccd471818", name: "Cong Nghe Thong Tin" },
  },
];

export function getUsers() {
  return users;
}

export function getUser(id) {
  return users.find((m) => m._id === id);
}

// export function saveUser(user) {
//   let userInDb = users.find(m => m._id === user._id) || {};
//   userInDb.name = movie.name;
//   userInDb.genre = genresAPI.genres.find(g => g._id === movie.genreId);
//   userInDb.numberInStock = movie.numberInStock;
//   userInDb.dailyRentalRate = movie.dailyRentalRate;

//   if (!movieInDb._id) {
//     movieInDb._id = Date.now();
//     movies.push(movieInDb);
//   }

//   return movieInDb;
// }

// export function deleteMovie(id) {
//   let movieInDb = movies.find(m => m._id === id);
//   movies.splice(movies.indexOf(movieInDb), 1);
//   return movieInDb;
// }
