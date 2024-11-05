import { ListResult } from "@/models";
import { RoomType } from "@sample/models/Hotel/RoomType";
import { ref } from "vue";

export function useRoomTypes() {
  const roomTypes = <RoomType[]>[
    { id: 1, name: "Single", active: true },
    { id: 2, name: "Double", active: true },
    { id: 3, name: "Triple", active: true },
  ];

  const boardTypes = [
    { id: 1, name: "Full board", active: true },
    { id: 2, name: "Half Board", active: true },
    { id: 3, name: "Bed and breakfast", active: true },
  ];

  function getAllRoomTypes(): ListResult<RoomType> {
    return <ListResult<RoomType>>{
      result: [...roomTypes],
      totalCount: roomTypes.length,
      pageCount: 1,
    };
  }

  function getRoomType(id: number) {
    return roomTypes.find((r) => r.id === id);
  }

  function getAllBoardTypes() {
    return <ListResult<RoomType>>{
      result: [...boardTypes],
      totalCount: boardTypes.length,
      pageCount: 1,
    };
  }
  function getBoardType(id: number) {
    return boardTypes.find((r) => r.id === id);
  }

  return {
    roomTypes,
    getAllRoomTypes,
    getRoomType,
    getAllBoardTypes,
    getBoardType,
  };
}
