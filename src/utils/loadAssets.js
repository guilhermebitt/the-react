export function getEntitiesAssets(entities) {
  let entitiesAssets = [];
  let checkedEntities = [];

  entities.forEach(entity => {
    // This will guarantee that the code won't pass the same entity
    if (checkedEntities.includes(entity?.data?.name)) return;

    // Adding the entity to the list of checked entities
    checkedEntities.push(entity?.data?.name);

    // Executing the rest of the code
    const entityAnimations = Object.values(entity?.data?.animations);
    
    entityAnimations.forEach(animation => {
      for (let i = 0; i < animation.frames.length; i++) {
        // This will guarantee that the code won't pass the same asset
        if (entitiesAssets.includes(animation.frames[i])) continue;

        // Adding the asset to the list of assets
        entitiesAssets.push(animation.frames[i])
      }
    })
  });

  return entitiesAssets;
}