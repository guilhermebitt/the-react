import { EntityData, Section } from "@/types";

export function getEntitiesAssets(entities: EntityData[]) {
  const entitiesAssets: string[] = [];
  const checkedEntities: string[] = [];

  // Checking if there is any entity
  if (!entities) {
    console.warn("⚠️ The getEntitiesAssets function did not receive any entities.");
    return;
  }

  entities.forEach((entity) => {
    // This will guarantee that the code won't pass the same entity
    if (checkedEntities.includes(entity?.name)) return;

    // Adding the entity to the list of checked entities
    checkedEntities.push(entity?.name);

    // Executing the rest of the code
    const entityAnimations = Object.values(entity?.animations);

    entityAnimations.forEach((animation) => {
      for (let i = 0; i < animation.frames.length; i++) {
        // This will guarantee that the code won't pass the same asset
        if (entitiesAssets.includes(animation.frames[i])) continue;

        // Adding the asset to the list of assets
        entitiesAssets.push(animation.frames[i]);
      }
    });
  });

  return entitiesAssets;
}

export function getMapAssets(mapData: Section[]) {
  // Clouds load was default
  const mapAssets: string[] = [
    "assets/map_sections/clouds/cloud_1.png",
    "assets/map_sections/clouds/cloud_2.png",
    "assets/map_sections/clouds/cloud_3.png",
    "assets/map_sections/clouds/cloud_full.png",
  ];
  const checkedMaps: string[] = [];

  mapData.forEach((section) => {
    // This will guarantee that the code won't pass the same map url
    if (checkedMaps.includes(section.url)) return;

    // Adding the map to the list of checked maps
    checkedMaps.push(section.url);

    // Executing the rest of the code
    mapAssets.push(section.url);
  });

  return mapAssets;
}
