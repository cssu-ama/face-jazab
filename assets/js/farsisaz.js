function traverseAndReplace(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    node.textContent = node.textContent.replace(
      /\d/g,
      (match) => persianDigits[match]
    );
  } else {
    for (let child of node.childNodes) {
      // جلوگیری از تغییر در کدهای اسکریپت و استایل
      if (child.nodeName !== "SCRIPT" && child.nodeName !== "STYLE") {
        traverseAndReplace(child);
      }
    }
  }
}

// اجرا روی کل بدنه سایت
traverseAndReplace(document.body);
