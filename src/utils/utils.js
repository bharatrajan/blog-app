let util = {
  uuid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },

  ts2Time: timestamp => {
    if (!timestamp) return;
    let ts = timestamp.toString();
    if (ts.length !== 13) ts = ts * 1000;
    let tsObj = new Date(timestamp);
    return (
      (tsObj.getMonth() + 1).toString() +
      '/' +
      tsObj.getDate().toString() +
      '/' +
      tsObj.getFullYear().toString()
    );
  },
};

export default util;
