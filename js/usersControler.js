document.addEventListener("alpine:init", () => {
  Alpine.data("usersData", () => ({
    mainUsers: [],
    users: [],
    pageUsers: [],

    isLoading: false,
    showAddModal: false,
    pageCounts: 1,
    itemsCount: 4,
    currentPage: 1,
    newUserInfo: {
      name: "",
      username: "",
      email: "",
    },

    userIdToEdit: null,

    getUsers() {
      this.isLoading = true;

      axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then((res) => {
          this.mainUsers = res.data;
          this.users = res.data;
          this.pagination();
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    pagination() {
      this.pageCounts = Math.ceil(this.users.length / this.itemsCount); // pageCounts = number of total pages //users.length = number of total items(users)
      let start = this.currentPage * this.itemsCount - this.itemsCount; // itemCounts = number of users that have been shown on pages(4=>8=>12=>...)
      let end = this.currentPage * this.itemsCount;
      this.pageUsers = this.users.slice(start, end);
    },

    nextPage() {
      this.currentPage++;
      this.pagination();
      if (this.currentPage > this.pageCounts) {
        this.currentPage = this.pageCounts;
        this.pagination();
      }
    },

    prevPage() {
      this.currentPage--;
      this.pagination();
      if (this.currentPage < 1) {
        this.currentPage = 1;
        this.pagination();
      }
    },

    handleChangeItemsCount(value) {
      if (value < 1) this.itemsCount = 1;
      if (value > this.users.length) this.itemsCount = this.users.length;
    },

    handleSearch(e) {
      setTimeout(() => {
        this.users = this.mainUsers.filter(
          (
            user // if didn't work add "(" <=
          ) =>
            user.name.includes(e.value) ||
            user.username.includes(e.value) ||
            user.email.includes(e.value)
        ); //and here ")" before the existing one <=
        this.currentPage = 1;
        this.pagination();
      }, 100);
    },

    handleSubmitAddUsersFrom() {
      this.isLoading = true;
      axios
        .post("https://jsonplaceholder.typicode.com/users/", this.newUserInfo)
        .then((res) => {
          if (res.status === 201) {
            this.mainUsers.push(res.data);
            this.showAddModal = false;
            handleResetForm;
            this.pagination();
            M.toast({ html: "User Added...", classes: "rounded green" });
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    handleResetForm() {
      this.newUserInfo = {
        name: "",
        username: "",
        email: "",
      };
    },

    handleDeleteUser(userId) {
      var toastHTML =
        "<span>Are You Sure ? (" +
        userId +
        ')</span><button class="btn-flat toast-action"x-on:click="handleConfirmDeleteUser(' +
        userId +
        ')">Delete</button>';
      M.toast({ html: toastHTML });
    },

    handleConfirmDeleteUser(userId) {
      this.isLoading = true;
      axios
        .delete("https://jsonplaceholder.typicode.com/users/" + userId)
        .then((res) => {
          console.log(res.status);
          if (res.status === 200) {
            this.mainUsers = this.mainUsers.filter(
              (user) => user.id !== userId
            );
            this.users = this.users.filter((user) => user.id !== userId);
            this.pagination();
            M.toast({ html: "User Deleted...", classes: "green" });
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    handleUpdateUser(user) {
      axios
        .get("https://jsonplaceholder.typicode.com/users/" + user.id)
        .then((res) => {
          if (res.status === 200) {
            this.newUserInfo = {
              name: res.data.name,
              username: res.data.username,
              email: res.data.email,
            };
            this.userIdToEdit = res.data.id
          } 
        });
        
        this.showAddModal = true;
    },

    handelConfirmEditUser(){
      this.isLoading = true
      axios
      .put("https://jsonplaceholder.typicode.com/users/" +this.userIdToEdit, this.newUserInfo)
      .then((res) => {
        if (res.status === 200) {
          const userIndex = this.mainUsers.findIndex(user=> user.id == this.userIdToEdit)
          this.mainUsers[userIndex] = res.data
          this.showAddModal = false;
          this.handleResetForm();
          this.userIdToEdit = null
          this.pagination();
          M.toast({ html: "User Updated...", classes: "rounded green" });
        }
      })
      .finally(() => {
        this.isLoading = false;
      });
    },





  }));
});
