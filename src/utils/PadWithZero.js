export default function padWithZeros(str,pad=5) {
    return str.toString().padStart(pad, '0');
}