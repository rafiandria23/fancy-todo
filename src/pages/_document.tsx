import React, { Fragment } from 'react';
import NextDocument, { DocumentContext } from 'next/document';
import { ServerStyleSheet as StyledComponentSheets } from 'styled-components';
import { ServerStyleSheets as MaterialUiServerStyleSheets } from '@material-ui/core/styles';

export default class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    const styledComponentSheets = new StyledComponentSheets();
    const materialUiSheets = new MaterialUiServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            styledComponentSheets.collectStyles(
              materialUiSheets.collect(<App {...props} />)
            )
        });
      
      const initialProps = await NextDocument.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: [
          <Fragment key="styles">
            {initialProps.styles}
            {materialUiSheets.getStyleElement()}
            {styledComponentSheets.getStyleElement()}
          </Fragment>
        ]
      }
    } finally {
      styledComponentSheets.seal();
    }
  }
}
