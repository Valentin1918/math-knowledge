app.factory("localStorage", [function() {
    function initData(key, value) {
        if(!(localStorage.getItem(key))) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }
    function getData(key) {
        return JSON.parse(localStorage.getItem(key));
    }
    function setData(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    function deleteData(key) {
        localStorage.removeItem(key);
    }
    return {
        initData: initData,
        getData: getData,
        setData: setData,
        deleteData: deleteData
    }
}]);
