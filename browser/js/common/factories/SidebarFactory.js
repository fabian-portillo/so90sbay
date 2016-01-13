app.factory('SidebarFactory', function () {
  var factory = {};

  var sidebarShow = false;

  factory.getSidebarState = () => {
    return sidebarShow;
  };

  factory.toggleCategories = () => {
    sidebarShow = sidebarShow === false ? true : false;
  };

  return factory;
});