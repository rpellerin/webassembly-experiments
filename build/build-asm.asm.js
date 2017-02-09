var asmCall = (function(global, env, buffer) {
 "use asm";
 function $(a) {
  a = a | 0;
  var b = 0, c = 0, d = 0, e = 0, f = 0;
  if (a >>> 0 < 3) {
   f = 1;
   return f | 0;
  } else {
   b = 1;
   e = 3;
  }
  do {
   c = e >>> 1;
   a : do if (e >>> 0 < 6) f = 5; else {
    d = 3;
    while (1) {
     if (!((e >>> 0) % (d >>> 0) | 0)) break a;
     d = d + 2 | 0;
     if (d >>> 0 > c >>> 0) {
      f = 5;
      break;
     }
    }
   } while (0);
   if ((f | 0) == 5) {
    f = 0;
    b = b + 1 | 0;
   }
   e = e + 2 | 0;
  } while (e >>> 0 <= a >>> 0);
  return b | 0;
 }
 return {
  _nbOfPrimesFound: $
 };
})(0,{STACKTOP:0},0)



