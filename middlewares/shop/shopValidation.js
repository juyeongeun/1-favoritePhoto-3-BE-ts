/* 판매할 포토카드 등록 시, 유효성 검사 */
const shopValidation = (req, res, next) => {
  const { price, totalCount } = req.body;
  if (!price || price < 0) {
    return res.status(400).json({ message: "가격을 입력해주세요." });
  }

  // totalCount가 0보다 작거나 같은 경우에 대한 체크
  if (!totalCount || totalCount <= 0) {
    return res.status(400).json({ message: "판매 수량을 입력해주세요." });
  }

  next();
};

/* 판매할 포토카드 수정 시, 유효성 검사 */
const shopEditValidation = (req, res, next) => {
  const { price, totalCount, remainingCount } = req.body;
  if (!price || price < 0) {
    return res.status(400).json({ message: "가격을 입력해주세요." });
  }

  // totalCount가 0보다 작거나 같은 경우에 대한 체크
  if (!totalCount || totalCount <= 0) {
    return res.status(400).json({ message: "판매 수량을 입력해주세요." });
  } else if (totalCount < remainingCount) {
    return res
      .status(400)
      .json({ message: "남은 카드의 수량을 확인해주세요." });
  }

  next();
};

export { shopValidation, shopEditValidation };
