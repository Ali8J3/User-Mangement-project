document.addEventListener("alpine:init", () => {
  Alpine.data("usersData", () => ({
    users: [],

    getUsers() {
      axios.get("https://jsonplaceholder.typicode.com/users").then((res) => {
        this.users = res.data;
        console.log(res);
      });
    },
  }));
});
