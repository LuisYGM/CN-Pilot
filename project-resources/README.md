# Project Resources

Esta carpeta contiene **material de entrada proporcionado por el usuario o cliente**, no código ni assets de producción. Coloca aquí solo recursos que una tarea necesite, por ejemplo logos, guías de marca, fuentes, fotos, vídeos, referencias, documentos, datos o código fuente recibido. Crea subcarpetas (`brand/`, `fonts/`, `media/`, `references/`, `source/`, `data/`) solo cuando hagan falta.

No guardes contraseñas, tokens, claves privadas, secrets, archivos `.env` ni credenciales. Antes de versionar cualquier material, confirma que su licencia, privacidad, tamaño y autorización lo permiten; su presencia aquí no lo añade automáticamente a Git.

Los archivos de entrada son original/input/reference, no la working implementation ni un product root aunque contengan código bajo `source/`. No modifiques el original por defecto. Inspecciona y selecciona únicamente los recursos relevantes; cuando una tarea explícita inicie adopción/importación de producto, prepara conscientemente una working copy activa bajo `product/` y conserva el original. No copies ni desempaquetes grandes árboles por rutina ni durante onboarding. No hagas que la aplicación dependa directamente de `project-resources/` ni publiques esta carpeta por inferencia.
