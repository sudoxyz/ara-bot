const skipParamValues = ['/', '-', '_', '.'];
/**
 * Function wrapper that handles optional arguments, used in validation and parsing
 * 
 * @param {Function} fn the function to wrap
 * @param {*} ret the value to return if 
 * @param {boolean} useRet call the function with ret instead if the ski 
 * @returns null or the return of fn
 */
module.exports = (fn, ret, useRet) => {
  useRet = (typeof useRet !== 'undefined') ? useRet : false;
  return (arg) => {
    if (!arg) return ret;
    if (!useRet && skipParamValues.includes(arg.toLowerCase())) return ret;
    let param = useRet ? ret : arg;
    return fn(param);
  };
};