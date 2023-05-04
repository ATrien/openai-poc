import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const deal = req.body.deal || '';
  if (deal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid deal description",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(deal),
      max_tokens: 500,
      n: 1,
      stop: null,
      temperature: 0.7,
    });
    console.log(completion.data);
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

// function generatePrompt(deal) {
//   return `This is a car wash deal generator. \n\n
  
//   Description: "$5 off membership coupon" \n
//   Headline: "$5 off your montly membership!" \n
//   Subheadline: "Sign up today and drive home in a clean car" \n
//   Description: "Wouldn't it be great to have a clean car all year round? Now you can with our unlimited membership program. Sign up today and get $5 off your first month!" \n\n

//   Description: "${deal}" \n
//   Headline: \n
//   Subheadline: \n
//   Description:`;
// }

function generatePrompt(deal) {
  return `Generate a deal headline, subheadline, a description, and a recommended image for a car wash app, based on the following deal description: "${deal}". 
  The description should be a single paragraph that makes the customer excited about redeeming the deal. 
  The recommended image should display text that describes an images closely related to the specific promotion. For example, if the promotion is for pollen season, the picture should be a car with pollen on it. 
  Display the headline, subheadline, description, and recommended image as a list formatted in HTML and bold the titles. The list should not have bullet points (list-style: none).`;
}
