document.addEventListener("alpine:init", () => {
  Alpine.data("usersData", () => ({
    users: [],
    pageUsers: [],

    isLoading: false,
    showAddModal: false,
    pageCounts: 1,
    itemsCount: 4,
    currentPage: 1,

    getUsers() {
      this.isLoading = true;

      axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then((res) => {
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
  }));
});