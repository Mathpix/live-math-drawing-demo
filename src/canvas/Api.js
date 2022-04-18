import axios from "axios";

const getConfig  = ()  => {
    const config = {
        headers: {
          app_id: process.env.REACT_APP_MATHPIX_API_ID,
          app_key: process.env.REACT_APP_MATHPIX_API_KEY,
          "Content-Type": "application/json",
        }
      };
    return config;
}

const getConfigWithToken = (tokenContext) => {
    const config = {
        headers: {
          app_token: tokenContext.app_token,
          strokes_session_id: tokenContext.strokes_session_id,
          "Content-Type": "application/json",
        }
      };
    return config;
}

export const getStrokesToken = async () => {
    const config = getConfig();
    const payload = {include_strokes_session_id: true};
    const response = await axios.post("https://api.mathpix.com/v3/app-tokens", payload, config);
    if (response.status === 200) {
      return {
        app_token: response.data.app_token,
        strokes_session_id: response.data.strokes_session_id,
        app_token_expires_at: response.data.app_token_expires_at
      };
    }
    return null;

}

export const getLatex = async (tokenContext, strokes) => {
  const config = getConfigWithToken(tokenContext);
  var X = [];
  strokes.map(stroke => {X.push(stroke.points.map(point => point.x))});
  var Y = [];
  strokes.map(stroke => {Y.push(stroke.points.map(point => point.y))});
  
  return axios.post('https://api.mathpix.com/v3/strokes', 
  { 
    "strokes": {
      "strokes": {
        "x": X,
        "y": Y
      }
    }
  }, config)
}
