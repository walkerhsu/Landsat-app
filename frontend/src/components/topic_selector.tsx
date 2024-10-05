import styles from "./styles/topic_selector.module.css";

interface AddTopicSelectProps {
  onSelect: (topic: string) => void;
  excludeTopics: string[];
}

export const AddTopicSelect: React.FC<AddTopicSelectProps> = ({
  onSelect,
  excludeTopics,
}) => {
  const allTopics = [
    "water",
    "landscape",
    "urban",
    "agriculture",
    "forest",
    "climate",
    "fire",
    "hot island",
    "space",
    "deforestation",
    "urbanization",
  ]; // Add all your topics here

  const availableTopics = allTopics.filter(
    (topic) => !excludeTopics.includes(topic)
  );

  return (
    <select
      className={styles.topicSelect}
      onChange={(e) => onSelect(e.target.value)}
      defaultValue=""
    >
      <option value="" disabled>
        Select a topic
      </option>
      {availableTopics.map((topic) => (
        <option key={topic} value={topic}>
          {topic}
        </option>
      ))}
    </select>
  );
};
