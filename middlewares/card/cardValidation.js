import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import {
  AWS_ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
} from "../../env.js";

// AWS S3 클라이언트 설정 (v3)
const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// 판매할 포토카드 등록 시, 유효성 검사
const cardValidation = async (req, res, next) => {
  try {
    const { name, grade, genre, description, totalCount } = req.body;

    // 이미지 파일도 유효성 검사 대상에 포함
    const imageURL = req.file ? req.file.location : "";

    if (!imageURL) {
      return res.status(400).json({ message: "이미지를 선택해주세요" });
    }

    if (!grade) {
      await deleteUploadedFile(req.file); // 이미지 삭제
      return res.status(400).json({ message: "등급을 선택해주세요" });
    }

    if (!genre) {
      await deleteUploadedFile(req.file); // 이미지 삭제
      return res.status(400).json({ message: "장르를 선택해주세요" });
    }

    if (!name || name.length < 3) {
      await deleteUploadedFile(req.file); // 이미지 삭제
      return res
        .status(400)
        .json({ message: "카드 이름은 3자 이상 입력해주세요." });
    }

    if (!description || description.length < 10) {
      await deleteUploadedFile(req.file); // 이미지 삭제
      return res
        .status(400)
        .json({ message: "카드 설명은 10자 이상 입력해주세요." });
    }

    if (!totalCount || totalCount <= 0) {
      await deleteUploadedFile(req.file); // 이미지 삭제
      return res.status(400).json({ message: "총 발행량을 입력해주세요." });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// AWS S3에 업로드된 파일 삭제
const deleteUploadedFile = async (file) => {
  try {
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: file.key, // S3에 저장된 파일의 키 값
    };
    await s3.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error("파일 삭제 중 오류가 발생했습니다.", error);
  }
};

export default cardValidation;
