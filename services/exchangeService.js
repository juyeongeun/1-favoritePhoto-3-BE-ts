import exchangeRepository from "../repositorys/exchangeRepository";

const whereConditions = (userId, keyword) => {
  const where = { userId };
  if (keyword) {
    where.OR = [
      {
        Shop: {
          card: {
            name: { contains: keyword, mode: "insensitive" },
          },
        },
      },
      {
        card: {
          name: { contains: keyword, mode: "insensitive" },
        },
      },
    ];
  }
  return where;
};

const createExchange = async (data) => {
  //판매의 남아있는 카드 수량을 검사하는 로직 필요
  try {
    const exchange = await exchangeRepository.create(data);
    return exchange;
  } catch (error) {
    error.status = 500;
    error.data = {
      message: "교환신청에 실패 했습니다.",
    };
    throw error;
  }
};

//요구사항에 없음 일단 제작
const updateExchange = async ({ id, data }) => {
  const exchange = await exchangeRepository.update({ id, data });

  return exchange;
};

const deleteExchange = async (id) => {
  const exchange = await exchangeRepository.deleteExchange(id);

  return exchange;
};

const getByUserId = async ({ userId, data }) => {
  const { limit = 5, cursor = "", keyword = "" } = data;
  const wheres = whereConditions(userId, keyword);
  const exchanges = await exchangeRepository.getByUserId({
    wheres,
    limit,
    cursor,
  });

  if (!exchanges) {
    const error = new Error("Not Found");
    error.status = 404;
    error.message = "카드를 찾지 못했습니다.";
    throw error;
  }
  //추가적인 데이터가 있는지 확인
  const nextExchanges = exchanges.length > limit;
  //추가 데이터가 있다면 커서값을 주고 데이터에서 리미트에 맞춰 돌려준다
  const nextCursor = nextExchanges ? exchanges[limit - 1].id : "";

  return {
    list: exchanges.slice(0, limit),
    nextCursor,
  };
};

const getByShopId = async (shopId) => {
  const exchanges = await exchangeRepository.getByShopId(shopId);

  if (!exchanges) {
    const error = new Error("Not Found");
    error.status = 404;
    error.message = "카드를 찾지 못했습니다.";
    throw error;
  }

  return exchanges;
};

export default {
  createExchange,
  updateExchange,
  deleteExchange,
  getByUserId,
  getByShopId,
};
