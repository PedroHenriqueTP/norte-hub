import streamlit as st
import pandas as pd
import plotly.express as px

# Configuração da página
st.set_page_config(page_title="Dashboard de Análise de Dados", layout="wide")

st.title("📊 Dashboard de Análise de Dados Interativa")

st.markdown("""
Esta dashboard permite que você faça upload de um CSV e explore os dados com filtros, estatísticas e gráficos interativos.
""")

# Upload do arquivo
uploaded_file = st.file_uploader("Escolha um arquivo CSV", type=["csv"])

if uploaded_file is not None:
    try:
        # Lê o CSV
        df = pd.read_csv(uploaded_file)
        st.success(f"Arquivo '{uploaded_file.name}' carregado com sucesso! ({len(df)} linhas, {len(df.columns)} colunas)")

        # Informações gerais do dataset
        st.subheader("📋 Informações do Dataset")
        col1, col2, col3 = st.columns(3)
        col1.metric("Número de linhas", len(df))
        col2.metric("Número de colunas", len(df.columns))
        col3.metric("Valores ausentes", df.isnull().sum().sum())

        # Tipos de dados
        st.write("Tipos de colunas:")
        st.dataframe(df.dtypes.to_frame(name="Tipo"), use_container_width=True)

        # Dados brutos
        st.subheader("🔍 Primeiras linhas dos dados")
        st.dataframe(df.head(10), use_container_width=True)

        # Resumo estatístico
        st.subheader("📈 Resumo Estatístico")
        st.dataframe(df.describe(include="all"), use_container_width=True)

        # Conversão de datas
        for col in df.columns:
            if "date" in col.lower() or "data" in col.lower():
                df[col] = pd.to_datetime(df[col], errors="ignore")

        # Filtros na sidebar
        st.sidebar.header("🔧 Filtros")
        df_filtrado = df.copy()

        for coluna in df.columns:
            if df[coluna].dtype == "object" or df[coluna].nunique() < 20:
                valores_unicos = sorted(df[coluna].dropna().unique())
                selecionados = st.sidebar.multiselect(f"{coluna}", options=valores_unicos, default=valores_unicos)
                if selecionados:
                    df_filtrado = df_filtrado[df_filtrado[coluna].isin(selecionados)]

        st.write(f"**Dados após filtros: {len(df_filtrado)} linhas**")

        # Visualizações Interativas
        st.subheader("📊 Visualizações Interativas")

        tipo_grafico = st.selectbox(
            "Escolha o tipo de gráfico",
            ["Scatter Plot", "Line Chart", "Bar Chart", "Histogram", "Box Plot", "Pie Chart"]
        )

        col_x = st.selectbox("Eixo X / Categoria", df_filtrado.columns)
        
        if tipo_grafico not in ["Histogram", "Pie Chart"]:
            col_y = st.selectbox("Eixo Y / Valor", df_filtrado.columns)
        else:
            col_y = None

        col_color = st.selectbox("Colorir por (opcional)", ["Nenhum"] + list(df_filtrado.columns))
        color = None if col_color == "Nenhum" else col_color

        # Geração do gráfico principal
        if tipo_grafico == "Scatter Plot":
            fig = px.scatter(df_filtrado, x=col_x, y=col_y, color=color, title=f"{col_x} vs {col_y}")
        elif tipo_grafico == "Line Chart":
            fig = px.line(df_filtrado, x=col_x, y=col_y, color=color, title=f"Linha: {col_y} por {col_x}")
        elif tipo_grafico == "Bar Chart":
            fig = px.bar(df_filtrado, x=col_x, y=col_y, color=color, title=f"Barras: {col_y} por {col_x}")
        elif tipo_grafico == "Histogram":
            fig = px.histogram(df_filtrado, x=col_x, color=color, title=f"Histograma de {col_x}")
        elif tipo_grafico == "Box Plot":
            fig = px.box(df_filtrado, x=col_x, y=col_y, color=color, title=f"Box Plot: {col_y} por {col_x}")
        elif tipo_grafico == "Pie Chart":
            fig = px.pie(df_filtrado, names=col_x, title=f"Distribuição de {col_x}")

        st.plotly_chart(fig, use_container_width=True)

        # Exportação
        st.subheader("💾 Exportar Dados Filtrados")
        csv = df_filtrado.to_csv(index=False).encode("utf-8")
        st.download_button(
            label="Baixar CSV filtrado",
            data=csv,
            file_name="dados_filtrados.csv",
            mime="text/csv"
        )

        # === NOVO: Heatmap de Correlação ===
        st.subheader("🔥 Heatmap de Correlação")
        numeric_df = df_filtrado.select_dtypes(include=['float64', 'int64'])
        if not numeric_df.empty and len(numeric_df.columns) > 1:
            fig_corr = px.imshow(
                numeric_df.corr(),
                text_auto=True,
                aspect="auto",
                color_continuous_scale='RdBu',
                title="Correlação entre variáveis numéricas"
            )
            st.plotly_chart(fig_corr, use_container_width=True)
        else:
            st.info("Não há colunas numéricas suficientes para gerar o heatmap.")

        # === NOVO: Insights Automáticos ===
        st.subheader("💡 Insights Automáticos")

        if 'Total Revenue' in df_filtrado.columns and 'Country' in df_filtrado.columns:
            top_country = df_filtrado.groupby('Country')['Total Revenue'].sum().idxmax()
            top_revenue = df_filtrado.groupby('Country')['Total Revenue'].sum().max()
            st.success(f"O país com maior receita total é **{top_country}** com ${top_revenue:,.2f}")

        if 'Units Sold' in df_filtrado.columns and 'Item Type' in df_filtrado.columns:
            top_item = df_filtrado.groupby('Item Type')['Units Sold'].sum().idxmax()
            top_units = df_filtrado.groupby('Item Type')['Units Sold'].sum().max()
            st.info(f"O produto mais vendido é **{top_item}** com {top_units:,} unidades")

    except Exception as e:
        st.error(f"Erro ao ler o arquivo: {e}")
        st.info("Dica: Verifique se o arquivo é um CSV válido, com separador vírgula e encoding UTF-8.")

else:
    st.info("👆 Faça upload de um arquivo CSV para começar a análise.")

st.caption("Desenvolvido com ❤️ usando Streamlit, Pandas e Plotly")