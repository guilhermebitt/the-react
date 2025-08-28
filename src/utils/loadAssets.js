export function getEntitiesAssets(entities) {
  let entitiesAssets = [];

  entities.forEach(entity => {
    const entityAnimations = Object.values(entity?.data?.animations);
    console.log(entity?.data?.name, entityAnimations);
  });

  return entitiesAssets;
}