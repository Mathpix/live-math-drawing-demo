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

export const getStrokesToken = async () => {
    const config = getConfig();
    const payload = {include_strokes_session_id: true};
    const response = await axios.post("https://api.mathpix.com/v3/app-tokens", payload, config);
    if (response.status === 200) {
      return {app_token: response.data.app_token, strokes_session_id: response.data.strokes_session_id};
    }
    return null;

}

export const getLatex = async (strokes) => {
  const config = getConfig();
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
