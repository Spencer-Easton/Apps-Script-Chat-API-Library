
/**
* Google Apps Script Library for the chat API
* 
* Documentation can be found: 
* https://developers.google.com/hangouts/chat
* 
* OAuth2 Scopes
* none
*/

var BASEURL_="https://chat.googleapis.com/";
var tokenService_;

/*
* Stores the function passed that is invoked to get a OAuth2 token;
* @param {function} service The function used to get the OAuth2 token;
*
*/
function setTokenService(service){
  tokenService_ = service;
}

/*
* Returns an OAuth2 token from your TokenService as a test
* @return {string} An OAuth2 token
*
*/
function testTokenService(){
 return tokenService_();
}

/**
 * Performs a Fetch
 * @param {string} url The endpoint for the URL with parameters
 * @param {Object.<string, string>} options Options to override default fetch options
 * @returns {Object.<string,string>} the fetch results
 * @private
 */
function CALL_(path,options){
  var fetchOptions = {method:"",muteHttpExceptions:true, contentType:"application/json", headers:{Authorization:"Bearer "+tokenService_()}}
  var url = BASEURL_ + path;
  
  for(option in options){
    fetchOptions[option] = options[option];
  }
  var response = UrlFetchApp.fetch(url, fetchOptions)
  
  if(response.getResponseCode() != 200){
    throw new Error(response.getContentText())
  }else{
    return JSON.parse(response.getContentText());
  }
}

/**
 * Performs a Fetch and accumulation using pageToken parameter of the returned results
 * @param {string} url The endpoint for the URL with parameters
 * @param {Object.<string, string>} options Options to override default fetch options
 * @param {string} returnParamPath The path of the parameter to be accumulated
 * @returns {Array.Object.<string,string>} An array of objects
 * @private
 */
function CALLPAGE_(path,options, returnParamPath){
  var fetchOptions = {method:"",muteHttpExceptions:true, contentType:"application/json", headers:{Authorization:"Bearer "+tokenService_()}}
  for(option in options){
    fetchOptions[option] = options[option];
  }
  var url = BASEURL_ + path;  
  var returnArray = [];
  var nextPageToken;
  do{
    if(nextPageToken){
      url = buildUrl_(url, {pageToken:nextPageToken});
    }
    var results = UrlFetchApp.fetch(url, fetchOptions);
    if(results.getResponseCode() != 200){
      throw new Error(results.getContentText());
    }else{
      var resp = JSON.parse(results.getContentText())
      nextPageToken = resp.nextPageToken;
      returnArray  = returnArray.concat(resp[returnParamPath])
    }
    url = BASEURL_ + path;
  }while(nextPageToken);
  return returnArray;
}

/**
 * Builds a complete URL from a base URL and a map of URL parameters. Written by Eric Koleda in the OAuth2 library
 * @param {string} url The base URL.
 * @param {Object.<string, string>} params The URL parameters and values.
 * @returns {string} The complete URL.
 * @private
 */
function buildUrl_(url, params) {
  var params = params || {}; //allow for NULL options
  var paramString = Object.keys(params).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');
  return url + (url.indexOf('?') >= 0 ? '&' : '?') + paramString;  
}


/**
* Lists spaces the caller is a member of.
*
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned ListSpacesResponseResource object
*/
function spacesList(options){
  var path = buildUrl_("v1/spaces",options);
  var callOptions = {method:"GET"};
  var ListSpacesResponseItems = CALLPAGE_(path,callOptions,"spaces");
  return ListSpacesResponseItems;
}

/**
* Returns a space.
*
* @param {string} name Required. Resource name of the space, in the form "spaces/X".Example: spaces/AAAAMpdlehY
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned SpaceResource object
*/
function spacesGet(name,options){
  var path = buildUrl_("v1/"+name,options);
  var callOptions = {method:"GET"};
  var SpaceResource = CALL_(path,callOptions);
  return SpaceResource;
}

/**
* Lists human memberships in a space.
*
* @param {string} parent Required. The resource name of the space for which membership list is to befetched, in the form "spaces/X".Example: spaces/AAAAMpdlehY
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned ListMembershipsResponseResource object
*/
function spacesMembersList(parent,options){
  var path = buildUrl_("v1/"+parent+"/members",options);
  var callOptions = {method:"GET"};
  var ListMembershipsResponseItems = CALLPAGE_(path,callOptions,"members");
  return ListMembershipsResponseItems;
}

/**
* Returns a membership.
*
* @param {string} name Required. Resource name of the membership to be retrieved, in the form"spaces/X/members/X".Example: spaces/AAAAMpdlehY/members/105115627578887013105
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned MembershipResource object
*/
function spacesMembersGet(name,options){
  var path = buildUrl_("v1/"+name,options);
  var callOptions = {method:"GET"};
  var MembershipResource = CALL_(path,callOptions);
  return MembershipResource;
}

/**
* Returns a message.
*
* @param {string} name Required. Resource name of the message to be retrieved, in the form"spaces/X/messages/X".Example: spaces/AAAAMpdlehY/messages/UMxbHmzDlr4.UMxbHmzDlr4
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned MessageResource object
*/
function spacesMessagesGet(name,options){
  var path = buildUrl_("v1/"+name,options);
  var callOptions = {method:"GET"};
  var MessageResource = CALL_(path,callOptions);
  return MessageResource;
}

/**
* Updates a message.
*
* @param {string} name Resource name, in the form "spaces/X/messages/X".Example: spaces/AAAAMpdlehY/messages/UMxbHmzDlr4.UMxbHmzDlr4
* @param {object} MessageResource An object containing the MessageResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned MessageResource object
*/
function spacesMessagesUpdate(name,MessageResource,options){
  var path = buildUrl_("v1/"+name,options);
  var callOptions = {method:"PUT",payload:JSON.stringify(MessageResource)};
  var MessageResource = CALL_(path,callOptions);
  return MessageResource;
}

/**
* Creates a message.
*
* @param {string} parent Required. Space resource name, in the form "spaces/X".Example: spaces/AAAAMpdlehY
* @param {object} MessageResource An object containing the MessageResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned MessageResource object
*/
function spacesMessagesCreate(parent,MessageResource,options){
  var path = buildUrl_("v1/"+parent+"/messages",options);
  var callOptions = {method:"POST",payload:JSON.stringify(MessageResource)};
  var MessageResource = CALL_(path,callOptions);
  return MessageResource;
}

/**
* Deletes a message.
*
* @param {string} name Required. Resource name of the message to be deleted, in the form"spaces/X/messages/X"Example: spaces/AAAAMpdlehY/messages/UMxbHmzDlr4.UMxbHmzDlr4
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned EmptyResource object
*/
function spacesMessagesDelete(name,options){
  var path = buildUrl_("v1/"+name,options);
  var callOptions = {method:"DELETE"};
  var EmptyResource = CALL_(path,callOptions);
  return EmptyResource;
}
