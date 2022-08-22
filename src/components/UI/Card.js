import styles from './Card.module.css';

const Card = (props) => {
  let mergedStyles = styles.card;
  if (props.className) {
    mergedStyles += ' ' + props.className;
  }
  return <div className={mergedStyles}>{props.children}</div>;
};

export default Card;
