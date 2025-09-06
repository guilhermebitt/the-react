//Components
import ComponentBorder from "../ui/ComponentBorder"

// Stylesheet
import styles from './sections.module.css'

function SkillsSection() {
  return (
    <ComponentBorder title="Skills">
      <div className={styles.skillsContainer}></div>
    </ComponentBorder>
  )
}

export default SkillsSection