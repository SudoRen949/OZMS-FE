
export const convertTo12Hour = (timeString) => {
	if (!timeString) return;
	let [hours, minutes] = timeString.split(":");
	let suffix = ( hours => 12 ) ? "PM" : "AM";
	hours = hours % 12 || 12;
	return `${hours}:${minutes} ${suffix}`;
}

export const generateOTP = () => 
{
	const rng = (a,b) => { return Math.floor( Math.random() * (b - a + 1) + a ) };
	const n = "0123456789";
	var token = "";
	for (let i = 0; i < 6; ++i) {
		token += n[rng(0,n.length-1)];
	}
	return token;
}

// export const cipher = (token) =>
// {
// 	if ( !token ) return;
// 	const [tokenId,tokenType,tokenName,tokenNumber] = token.split(".");
// 	const shift = 7;
// 	const letters = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ";
// 	var output = "";
// 	// cipher first string
// 	for ( var i = 0; i < tokenId.length; i++ ) {
// 		for ( var j = 0; j < letters.length; j++ ) {
// 			if ( j <= letters.length-shift && tokenId[i] === letters[j] ) {
// 				output += letters[j+shift];
// 				break;
// 			} else {
// 				if ( j > letters.length-shift && tokenId[i] === letters[j] ) {
// 					switch ( tokenId[i] ) {
// 					case 'W': output += letters[0]; break;
// 					case 'x': output += letters[1]; break;
// 					case 'X': output += letters[2]; break;
// 					case 'y': output += letters[3]; break;
// 					case 'Y': output += letters[4]; break;
// 					case 'z': output += letters[5]; break;
// 					case 'Z': output += letters[6]; break;
// 					}
// 					break;
// 				}
// 			}
// 		}
// 	}
// 	output += "0";
// 	// cipher second string
// 	for ( var i = 0; i < tokenType.length; i++ ) {
// 		for ( var j = 0; j < letters.length; j++ ) {
// 			if ( j <= letters.length-shift && tokenType[i] === letters[j] ) {
// 				output += letters[j+shift];
// 				break;
// 			} else {
// 				if ( j > letters.length-shift && tokenType[i] === letters[j] ) {
// 					switch ( tokenType[i] ) {
// 					case 'W': output += letters[0]; break;
// 					case 'x': output += letters[1]; break;
// 					case 'X': output += letters[2]; break;
// 					case 'y': output += letters[3]; break;
// 					case 'Y': output += letters[4]; break;
// 					case 'z': output += letters[5]; break;
// 					case 'Z': output += letters[6]; break;
// 					}
// 					break;
// 				}
// 			}
// 		}
// 	}
// 	output += "0";
// 	// cipher third string
// 	for ( var i = 0; i < tokenName.length; i++ ) {
// 		for ( var j = 0; j < letters.length; j++ ) {
// 			if ( j <= letters.length-shift && tokenName[i] === letters[j] ) {
// 				output += letters[j+shift];
// 				break;
// 			} else {
// 				if ( j > letters.length-shift && tokenName[i] === letters[j] ) {
// 					switch ( tokenName[i] ) {
// 					case 'W': output += letters[0]; break;
// 					case 'x': output += letters[1]; break;
// 					case 'X': output += letters[2]; break;
// 					case 'y': output += letters[3]; break;
// 					case 'Y': output += letters[4]; break;
// 					case 'z': output += letters[5]; break;
// 					case 'Z': output += letters[6]; break;
// 					}
// 					break;
// 				}
// 			}
// 		}
// 	}
// 	output += "0";
// 	// cipher third string
// 	for ( var i = 0; i < tokenName.length; i++ ) {
// 		for ( var j = 0; j < letters.length; j++ ) {
// 			if ( j <= letters.length-shift && tokenName[i] === letters[j] ) {
// 				output += letters[j+shift];
// 				break;
// 			} else {
// 				if ( j > letters.length-shift && tokenName[i] === letters[j] ) {
// 					switch ( tokenName[i] ) {
// 					case 'W': output += letters[0]; break;
// 					case 'x': output += letters[1]; break;
// 					case 'X': output += letters[2]; break;
// 					case 'y': output += letters[3]; break;
// 					case 'Y': output += letters[4]; break;
// 					case 'z': output += letters[5]; break;
// 					case 'Z': output += letters[6]; break;
// 					}
// 					break;
// 				}
// 			}
// 		}
// 	}
// 	console.log(output + tokenNumber);
// }

export default {
	convertTo12Hour,
	generateOTP
};
