import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Buffer } from "buffer";
import { NodeNextRequest } from "next/dist/server/base-http/node";

export default function Home() {
  const checkImage = (e: { target: { files: any } }) => {
    const files = e.target.files;

    const imgType = ["png", "jpeg", "jpg", "gif"];

    if (imgType.includes(files[0].type.split("/")[1]) === false) {
      alert(
        "画像ファイルを選択してください。\n画像ファイルはpng, jpeg, jpg, gifのみ対応しています。"
      );
      location.reload();
      return;
    }
    const img = document.getElementById("preview");
    const img2 = document.getElementById("preview2");
    const secret = document.getElementById("secret");
    const fileReader = new FileReader();
    if (img && e.target.files[0]) {
      fileReader.onload = function (e?: any) {
        img.setAttribute("src", e.target.result as string);
        if (img2 === null || secret === null) return;
        img2.setAttribute("src", e.target.result as string);
        secret.setAttribute("value", e.target.result as string);
      };
      fileReader.readAsDataURL(files[0]);
    }
  };

  const uploadImage = () => {
    const hidden = document.getElementById("hidden");
    if (hidden === null) return;
    hidden.style.display = "none";

    const secret = document.getElementById("secret");
    if (secret === null) return;
    const base64 = secret.getAttribute("value");
    if (base64 === null) return;
    const formData = new FormData();
    formData.append("image", base64);
    const url = "https://" + location.host + "/upload.php";
    var path = "https://" + location.host;

    const response = fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        path = path + "/" + data["file_name"];
        alert("画像のアップロードが完了しました。");
        var d1 = document.getElementById("show");
        if (d1 === null) return;
        d1.style.display = "block";
        var d2 = document.getElementById("url");
        if (d2 === null) return;
        d2.setAttribute("href", path);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("画像のアップロードに失敗しました");
        // reload
        location.reload();
      });
  };

  const copyToClipboard = () => {
    var uelement = document.getElementById("url");
    if (uelement === null) return;
    const url = uelement.getAttribute("href");
    const textArea = document.createElement("textarea");
    textArea.textContent = url;
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
    alert("URLをコピーしました");
  };

  return (
    <div className={styles.container}>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css"
      ></link>
      <h1
        className="title is-1"
        style={{
          textAlign: "center",
          paddingTop: "50px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        画像uploader
      </h1>
      <p
        style={{
          textAlign: "center",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
      </p>
      <div
        id="hidden"
        style={{
          textAlign: "center",
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          marginTop: "50px",
        }}
      >
        <input type="file" id="fileinput" onChange={checkImage} />
        <button onClick={uploadImage}>アップロードする</button>
        <img
          id="preview2"
          alt=""
          style={{
            maxWidth: "100%",
            maxHeight: "600px",
            height: "100%",
            border: "1px solid blue",
            marginTop: "10px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </div>
      <div
        id="show"
        style={{
          display: "none",
          textAlign: "center",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <p>アップロード完了</p>
        <a
          style={{ display: "none", marginLeft: "auto", marginRight: "auto" }}
          id="url"
          href=""
        ></a>
        <button onClick={copyToClipboard}>URLをクリップボードにコピー</button>
        <div></div>
        <button onClick={() => location.reload()}>
          もう一度アップロードする
        </button>

        <img
          id="preview"
          alt=""
          style={{
            maxWidth: "100%",
            maxHeight: "600px",
            height: "100%",
            border: "1px solid blue",
            marginTop: "10px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </div>
      <div>
        <img
          src=""
          id="preview"
          alt=""
          style={{
            maxWidth: "100%",
            maxHeight: "600px",
            height: "100%",
            border: "1px solid blue",
            marginTop: "10px",
          }}
        />
      </div>
      <p
        id="secret"
        style={{
          width: 0,
          height: 0,
          overflow: "hidden",
          display: "none",
        }}
      ></p>
    </div>
  );
}
