/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import viaTheme from 'es-components-via-theme';
import ReactDOM from 'react-dom';
import { debounce } from 'lodash';
import Spinner from './components/base/spinner/Spinner';
import FullColorIcon from './components/base/icons/FullColorIcon';

const iconsListUrl =
  'https://bdaim-webexcdn-p.azureedge.net/es-assets?restype=directory&comp=list';

const OuterContainer = styled.div`
  text-align: center;
  width: 100%;
`;

const IconsContainer = styled.div`
  display: grid;
  grid-auto-rows: max-content;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 180px));
  justify-content: center;
  justify-items: center;
  margin: 0 auto;
  margin-bottom: 40px;
  max-width: 1200px;
`;

const IconContainer = styled.div`
  text-align: center;
`;

const SpinnerContainer = styled.div`
  margin: 0 auto;
  width: 100px;
`;

const HighlightSpan = styled.span`
  background-color: rgba(113, 194, 255, 0.65);
`;

function DisplayName({ name, highlight }) {
  const highlightStart = name.indexOf(highlight);
  if (!highlight.length || highlightStart < 0) return name;
  const values = useMemo(() => {
    const highlightEnd = highlightStart + highlight.length;
    const pre = highlightStart > 0 ? name.substring(0, highlightStart) : '';
    const post =
      highlightEnd >= name.length ? '' : name.substring(highlightEnd);
    return { pre, post };
  }, [name, highlight]);
  return (
    <div css={{ marginTop: 10 }}>
      {values.pre}
      <HighlightSpan>{highlight}</HighlightSpan>
      {values.post}
    </div>
  );
}

DisplayName.propTypes = {
  name: PropTypes.string.isRequired,
  highlight: PropTypes.string.isRequired
};

function DisplayFCIcon({ name, highlight, ...props }) {
  return (
    <IconContainer {...props}>
      <FullColorIcon
        name={name}
        highlight={highlight}
        size={100}
        css={{ margin: '0 auto' }}
      />
      <DisplayName name={name} highlight={highlight} />
    </IconContainer>
  );
}

DisplayFCIcon.propTypes = {
  name: PropTypes.string.isRequired,
  highlight: PropTypes.string.isRequired
};

function FullColorIconsApp() {
  const [icons, setIcons] = useState([]);
  const [iconFilter, setIconFilter] = useState('');

  const iconDisplayValue = useCallback(
    name => (name.includes(iconFilter) ? 'inherit' : 'none'),
    [iconFilter]
  );

  const debouncedSetFilter = useCallback(
    debounce(value => setIconFilter(value), 150)
  );
  const filterVisible = useCallback(({ target: { value } }) =>
    debouncedSetFilter(value)
  );

  useEffect(() => {
    const getIcons = async () => {
      const iconsResponse = await fetch(iconsListUrl);
      const iconsText = await iconsResponse.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(iconsText, 'text/xml');
      const foundIcons = [...xmlDoc.getElementsByTagName('Blob')]
        .filter(blob => {
          const nameTag = blob.getElementsByTagName('Name');
          const name = nameTag[0].textContent;
          return name.includes('full-color-icons');
        })
        .map(blob => {
          const fullName = blob.getElementsByTagName('Name')[0].textContent;
          return fullName.match(/full-color-icons\/(.*)\.svg/)[1];
        });
      setIcons(foundIcons);
    };
    getIcons();
  }, []);

  return (
    <OuterContainer>
      {icons.length ? (
        <>
          <div css={{ marginBottom: 40 }}>
            <label htmlFor="filter">
              <h2 css={{ display: 'inline' }}>Filter Icons:</h2>
              <input
                css={{ marginLeft: 10 }}
                id="filter"
                onChange={filterVisible}
                type="text"
              />
            </label>
          </div>
          <IconsContainer>
            {icons.map(name => (
              <DisplayFCIcon
                css={{
                  display: iconDisplayValue(name)
                }}
                name={name}
                highlight={iconFilter}
                key={name}
              />
            ))}
          </IconsContainer>
        </>
      ) : (
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      )}
    </OuterContainer>
  );
}

ReactDOM.render(
  <ThemeProvider theme={viaTheme}>
    <FullColorIconsApp />
  </ThemeProvider>,
  document.getElementById('mount')
);
