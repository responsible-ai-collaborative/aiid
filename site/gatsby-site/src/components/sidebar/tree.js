import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { ChevronDown, ChevronRight } from 'react-feather';
import Link from '../ui/Link'; // Assuming you have this component for internal links
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faChartPie,
  faDice,
  faDoorOpen,
  faList,
  faMedal,
  faNewspaper,
  faPlusCircle,
  faSearch,
  faShapes,
  faSquareCheck,
  faTable,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation } from '@reach/router';

const TreeNode = ({ item, isCollapsed, onClick, setNavCollapsed, level = 0, className = '' }) => {
  const hasChildren = item.items && item.items.length > 0;

  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const icon = getIcon(item.label, item.current);

  const calculatedClassName = `${className || ''} item ${
    item.current
      ? 'active bg-light-orange text-white dark:bg-gray-700'
      : 'text-white md:text-inherit hover:bg-light-orange dark:text-white hover:text-white dark:hover:bg-gray-700'
  }`;

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpand();
    }
  };

  return (
    <li className="tree-node">
      <div
        className={`tree-node-header flex items-center cursor-pointer rounded-md ${
          isCollapsed ? 'collapsed' : ''
        }`}
        onClick={() => {
          if (hasChildren) {
            toggleExpand();
          }
          if (!hasChildren && setNavCollapsed) {
            setNavCollapsed(true);
          }
        }}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown} // Make the div keyboard accessible
        aria-expanded={isExpanded}
        aria-label={item.title}
      >
        {/* Toggle Icon (if it has children) */}
        {hasChildren && (
          <span className="mr-2">{isExpanded ? <ChevronDown /> : <ChevronRight />}</span>
        )}

        {/* Link to the item if it has a URL or Path */}
        {item.url || item.path ? (
          <Link
            title={item.title}
            to={item.url || item.path}
            onClick={onClick}
            className={`hover:no-underline flex rounded-lg items-center p-2 md:text-base font-normal group transition-none w-full ${
              isCollapsed ? 'w-10 h-10' : ''
            } ${calculatedClassName}`}
            data-testid={`sidebar-link${item.current ? '-active' : ''}`}
          >
            {icon && (isCollapsed ? <span className="tooltip">{icon}</span> : <>{icon}</>)}
            <span className={`ml-3 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              <Trans>{item.title}</Trans>
            </span>
          </Link>
        ) : (
          <span className="tree-node-title ml-3">
            <Trans>{item.title}</Trans>
          </span>
        )}
      </div>

      {/* Render children recursively */}
      {hasChildren && isExpanded && (
        <ul className={`ml-${(level + 1) * 4}`}>
          {item.items.map((childItem) => (
            <TreeNode
              key={childItem.url || childItem.path || childItem.title}
              item={childItem}
              isCollapsed={isCollapsed}
              onClick={onClick}
              setNavCollapsed={setNavCollapsed}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const Tree = ({ items, isCollapsed, setNavCollapsed, localizePath, additionalNodes = [] }) => {
  const location = useLocation(); // Listen for location changes

  const [currentLocation, setCurrentLocation] = React.useState('');

  React.useEffect(() => {
    setCurrentLocation(location.pathname); // Update the current location on path change
  }, [location]);

  const subtreeNav = (subItems) => {
    return subItems.map((item) => {
      const localizedPath = localizePath({ path: item.url || item.path });

      const currentVisit =
        currentLocation &&
        [localizedPath, `${localizedPath}/`].includes(localizePath({ path: currentLocation }));

      let childVisit = false;

      const children = item.items?.length > 0 ? subtreeNav(item.items) : [];

      children.forEach((childItem) => {
        if (
          !childVisit &&
          [
            localizePath({ path: childItem.url }),
            `${localizePath({ path: childItem.url })}/`,
          ].includes(currentLocation)
        ) {
          childVisit = true;
        }
      });

      return {
        ...item,
        items: children,
        current: currentVisit,
        collapsed: !currentVisit && !childVisit,
        childVisit,
      };
    });
  };

  const processedItems = subtreeNav([...items, ...additionalNodes]);

  return (
    <ul className="tree flex flex-col space-y-2">
      {processedItems.map((item) => (
        <TreeNode
          key={item.url || item.path || item.title}
          item={item}
          isCollapsed={isCollapsed}
          setNavCollapsed={setNavCollapsed}
        />
      ))}
    </ul>
  );
};

function getIcon(label, current = false) {
  const fontAwesomeStyles = `
    w-6 h-6
    transition-[width] duration-500 

    group-hover:text-white 
    dark:group-hover:text-white 
    pointer fa
    
    ${current ? 'text-white' : 'text-gray-400 md:text-gray-600'}
  `;

  return (
    {
      welcome: (
        <FontAwesomeIcon titleId="welcome" icon={faDoorOpen} className={fontAwesomeStyles} />
      ),
      discover: (
        <FontAwesomeIcon titleId="discover" icon={faSearch} className={fontAwesomeStyles} />
      ),
      submit: (
        <FontAwesomeIcon titleId="submit" icon={faPlusCircle} className={fontAwesomeStyles} />
      ),
      leaderboard: (
        <FontAwesomeIcon titleId="leaderboard" icon={faMedal} className={fontAwesomeStyles} />
      ),
      list: <FontAwesomeIcon titleId="list" icon={faList} className={fontAwesomeStyles} />,
      blog: <FontAwesomeIcon titleId="blog" icon={faNewspaper} className={fontAwesomeStyles} />,
      taxonomies: (
        <FontAwesomeIcon titleId="taxonomies" icon={faChartPie} className={fontAwesomeStyles} />
      ),
      incidents: (
        <FontAwesomeIcon titleId="incidents" icon={faTable} className={fontAwesomeStyles} />
      ),
      entities: (
        <FontAwesomeIcon titleId="entities" icon={faBuilding} className={fontAwesomeStyles} />
      ),
      user: <FontAwesomeIcon titleId="user" icon={faUser} className={fontAwesomeStyles} />,
      checklists: (
        <FontAwesomeIcon titleId="entities" icon={faSquareCheck} className={fontAwesomeStyles} />
      ),
      random: <FontAwesomeIcon titleId="random" icon={faDice} className={fontAwesomeStyles} />,
      spatial: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 8.4666665 8.4666669"
          fill="currentColor"
          stroke="none"
          className={`
          w-6 h-6 shrink-0
          ${current ? 'text-white' : 'text-gray-400 md:text-gray-600'}
          group-hover:text-white dark:group-hover:text-white
        `}
        >
          <circle id="c1" cx="1.4249661" cy="3.3814588" r="1.2797676" />
          <circle id="c2" cx="2.6276002" cy="6.9394135" r="1.2797676" />
          <circle id="c3" cx="4.7233200" cy="4.6742487" r="1.2797676" />
          <circle id="c4" cx="6.6127176" cy="6.8885708" r="1.2797676" />
          <circle id="c5" cx="6.1704326" cy="1.5272532" r="1.2797676" />
        </svg>
      ),
      newsdigest: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 12 12"
          fill="currentColor"
          stroke="none"
          className={`
          w-6 h-6 shrink-0
          ${current ? 'text-white' : 'text-gray-400 md:text-gray-600'}
          group-hover:text-white dark:group-hover:text-white
        `}
        >
          <rect x="0" y="2" width="5.5" height="2" rx="1" />
          <rect x="0" y="5" width="5.5" height="2" rx="1" />
          <rect x="0" y="8" width="5.5" height="2" rx="1" />

          <rect x="6.5" y="2" width="5.5" height="2" rx="1" />
          <rect x="6.5" y="5" width="5.5" height="2" rx="1" />
          <rect x="6.5" y="8" width="5.5" height="2" rx="1" />
        </svg>
      ),
    }[label] || <FontAwesomeIcon titleId={label} icon={faShapes} className={fontAwesomeStyles} />
  );
}

Tree.propTypes = {
  items: PropTypes.array.isRequired,
  isCollapsed: PropTypes.bool,
  setNavCollapsed: PropTypes.func,
  localizePath: PropTypes.func,
  additionalNodes: PropTypes.array,
};

export default Tree;
