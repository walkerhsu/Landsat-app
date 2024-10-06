from user_data import SR_data
import openai

PROMPTS = """\
Given the following satellite imagery data, provide a detailed analysis of the scene in 100 words.

Satellite Imagery Data:
- HEX : {hex}
- NDVI: {ndvi}
- NDWI: {ndwi}
- EVI: {evi}
- SAVI: {savi}
- NDMI: {ndmi}
- NBR: {nbr}
- NBR2: {nbr2}
- NDSI: {ndsi}

Please be concise and use simple language.
"""

def chat_completion(SR_data: SR_data, API_KEY: str):
    client = openai.OpenAI(api_key=API_KEY)
    print(client)
    prompt = PROMPTS.format(
        hex=str(SR_data.color),
        ndvi=str(SR_data.ndvi),
        ndwi=str(SR_data.ndwi),
        evi=str(SR_data.evi),
        savi=str(SR_data.savi),
        ndmi=str(SR_data.ndmi),
        nbr=str(SR_data.nbr),
        nbr2=str(SR_data.nbr2),
        ndsi=str(SR_data.ndsi),
    )
    print(prompt)
    messages = [
        {"role": "system", "content": "You are a helpful assistant that analyzes satellite imagery data."},
        {"role": "user", "content": prompt}
    ]
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=1024,
        temperature=0.5,
    )
    response_text = response.choices[0].message.content
    return response_text

