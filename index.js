"use strict"

class JSONUtils {
  /**
	*  After several sessions debugging Object.assign and {...a, ...b, ...c}
	*  results and discovering that left and middle sub objects get clobbered
	*  no matter what, I've written this out of exasperation.
  *
	*  This guarantees that the left original object won't get clobbered,
	*  and returns a merged object as expected.
  *
	*  A bonus is that observers are cleaned out of both objects.
  *
  *  Caveats:
  *   - Doesn't work for objects with functions (data only)
	*   - Performance may be an issue, but if it is, I'll address it here.
	*
	*  29-Jan-2019 - rickb
	*  
  */
  static deepAssign(_a, _b) {		
		let a = JSON.parse(JSON.stringify(_a));	
		let b = JSON.parse(JSON.stringify(_b));	
              // get rid of observers in both

    if (Array.isArray(a) && Array.isArray(b))
      return a + [...b];
    else
      return {...a, ...b};
	}

  /**
   * There is no native equivalent to this other than assign({}, o) or
   * {{}, ...o} which are clunky to remember and use.  Use those for
   * objs with funcs -- this still strips out observers, etc.
   * 
   * @param {*} o 
   */
  static copyObj(o) {
    return JSON.parse(JSON.stringify(o))
  }

  /**
   * Deeply compare object values in object b to object a.  Return true if they are the same,
   * false if differ (or if keys in b don't exist in a)
   * 
   * @param {object} a 
   * @param {object} b 
   */
  static cmpObj(a,b) {
    let objKeys = Object.keys(b);
    let bkey;
    for (let ix = 0; ix < objKeys.length; ++ix) {
      bkey = objKeys[ix];
      if (!(bkey in a))
        return false;

      if (_.isObject(b[bkey])) {
        if (!_.isObject(a[bkey]))
          return false;

        return AphJSUtils.objcmp(a[bkey],b[bkey]);
      }

      if (a[bkey] !== b[bkey])
        return false;
    }

    return true;
  }
}

export default JSONUtils
