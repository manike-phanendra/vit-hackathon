import streamlit as st
import streamlit.components.v1 as components
import os
import base64

st.set_page_config(
    page_title="KrishiShield — Parametric Micro-Insurance",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Streamlit CSS Overrides for Full-Screen Render
st.markdown("""
<style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .block-container {
        padding: 0rem !important;
        margin: 0rem !important;
        max-width: 100% !important;
    }
    .element-container {
        margin: 0rem !important;
        padding: 0rem !important;
    }
    iframe {
        width: 100vw !important;
        height: 100vh !important;
        border: none !important;
    }
</style>
""", unsafe_allow_html=True)

@st.cache_data
def get_bundled_react_app():
    base_dir = os.path.dirname(__file__)
    dist_dir = os.path.join(base_dir, 'frontend', 'dist')
    
    bg_data_uri = ""
    bg_path = os.path.join(dist_dir, 'bg-farm.png')
    if os.path.exists(bg_path):
        with open(bg_path, 'rb') as f:
            bg_b64 = base64.b64encode(f.read()).decode('utf-8')
        bg_data_uri = f'data:image/png;base64,{bg_b64}'

    assets_dir = os.path.join(dist_dir, 'assets')
    css_content = ""
    js_content = ""
    
    if os.path.exists(assets_dir):
        for f in os.listdir(assets_dir):
            if f.endswith('.css'):
                with open(os.path.join(assets_dir, f), 'r', encoding='utf-8') as cfile:
                    css_content += cfile.read() + "\n"
            elif f.endswith('.js'):
                with open(os.path.join(assets_dir, f), 'r', encoding='utf-8') as jfile:
                    js_content += jfile.read() + "\n"

    if bg_data_uri:
        css_content = css_content.replace('/bg-farm.png', bg_data_uri).replace('bg-farm.png', bg_data_uri)
        js_content = js_content.replace('/bg-farm.png', bg_data_uri).replace('bg-farm.png', bg_data_uri)

    bundled_html = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>KrishiShield — Parametric Micro-Insurance</title>
    <style>
      html, body {{
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
        overflow-x: hidden;
        background-color: #05110b;
      }}
      {css_content}
    </style>
  </head>
  <body class="bg-agri-dark">
    <div id="root"></div>
    <script type="module">
      {js_content}
    </script>
  </body>
</html>"""
    return bundled_html

html_payload = get_bundled_react_app()
components.html(html_payload, height=950, scrolling=True)
