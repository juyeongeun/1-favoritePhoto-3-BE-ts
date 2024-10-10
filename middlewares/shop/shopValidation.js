export const shopValidation = (req, res, next) => {
  const { price, totalCount } = req.body;
  if (!price || price < 0) {
    return res.status(400).json({ message: "가격을 입력해주세요." });
  }

  if (!totalCount || totalCount < 0) {
    return res.status(400).json({ message: "판매 수량을 입력해주세요." });
  }
};

export const shopEditValidation = (req, res, next) => {
  const { price, totalCount, remainingCount } = req.body;
  if (!price || price < 0) {
    return res.status(400).json({ message: "가격을 입력해주세요." });
  }

  if (!totalCount || totalCount < 0) {
    return res.status(400).json({ message: "판매 수량을 입력해주세요." });
  } else if (totalCount < remainingCount) {
    return res
      .status(400)
      .json({ message: "남은 카드의 수량을 확인해주세요." });
  }
};
