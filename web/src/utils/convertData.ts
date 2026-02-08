import type { BlipColumn } from '../store/blips';
import type { StoreState } from '../store';

// Converts groups data from DB format (object) to form format (array)
export const convertData = (data: BlipColumn): StoreState => {
  const newGroupsData: { name: string; grade: number }[] = [];
  if (data.groups) {
    const blipGroupsData = Object.entries(data.groups);
    for (let i = 0; i < blipGroupsData.length; i++) {
      const groupObj = blipGroupsData[i];
      newGroupsData[i] = { name: groupObj[0], grade: groupObj[1] };
    }
  }

  // Destructure out DB-only fields, spread the rest as StoreState
  const { id: _id, zone: _zone, ...storeFields } = data;
  return {
    ...storeFields,
    groups: [...newGroupsData],
    items: data.items,
  };
};
