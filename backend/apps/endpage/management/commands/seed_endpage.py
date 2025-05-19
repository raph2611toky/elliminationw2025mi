# apps/endpage/management/commands/seed_all.py

import os
import random
import traceback
from uuid import uuid4

from django.core.files import File
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.conf import settings
from apps.user.models import User

from apps.endpage.models import (
    EndPage,
    EndPageImage,
    EndPageFile,
    Video,
    Avatar,
    Scenario,
    Scene,
)
from openai import OpenAI
from dotenv import load_dotenv
from helpers.services.chat.api import simple_chat

load_dotenv()

class Command(BaseCommand):
    help = "Seed Users, EndPages, Images, Files, Videos, Avatars, Scenarios, Scenes, and Reactions"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Starting full seeding..."))
        Scene.objects.all().delete()
        Scenario.objects.all().delete()
        Video.objects.all().delete()
        EndPageFile.objects.all().delete()
        EndPageImage.objects.all().delete()
        EndPage.objects.all().delete()
        Avatar.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()
        self.stdout.write(self.style.SUCCESS("Cleared existing EndPage-related data."))

        # 1. Create 6 users
        users = []
        sexes = ['M', 'F']
        for i in range(6):
            email = f"user{i}@example.com"
            user,_ = User.objects.get_or_create(
                email=email,
                name=f"User{i}",
                password="TestPassword123",
                sexe=random.choice(sexes),
                is_active=True,
            )
            
            avatar,_ = Avatar.objects.get_or_create(
                user=user,
                mode=random.choice(['RELAX', 'PRO']),
                sexe='FEMININ' if user.sexe == 'F' else 'MASCULIN' if user.sexe == 'M' else 'FEMININ',
                pseudo=user.name
            )
            users.append(user)
        self.stdout.write(self.style.SUCCESS("6 users (and their Avatars) created."))

        # 2. Paths for media files under MEDIA_ROOT
        MEDIA = settings.MEDIA_ROOT
        endpage_images_dir = os.path.join(MEDIA, "endpage", "images")
        endpage_audio_dir = os.path.join(MEDIA, "endpage", "audio")
        endpage_files_dir = os.path.join(MEDIA, "endpage", "files")
        placeholder_pdf = os.path.join(endpage_files_dir, "placeholder.pdf")
        video_mp4_1 = os.path.join(MEDIA, "lady.mp4")
        video_mp4_2 = os.path.join(MEDIA, "ladydi.mp4")

        # Collect all filenames in images/audio for random selection
        available_images = [
            os.path.join(endpage_images_dir, fname)
            for fname in os.listdir(endpage_images_dir)
            if fname.lower().endswith((".png", ".jpg", ".jpeg"))
        ]
        available_audio_mp3 = [
            os.path.join(endpage_audio_dir, fname)
            for fname in os.listdir(endpage_audio_dir)
            if fname.lower().endswith(".mp3")
        ]

        # 3. Create 4 EndPages
        types = ['démission', 'départ', 'rupture', 'ABANDON']
        tons = ['DRAMATIQUE', 'IRONIQUE', 'HUMORISTIQUE', 'SERIEUX', 'OPTIMISTE', 'NOSTALGIQUE', 'POETIQUE', 'SARCASTIQUE', 'REFLEXIF', 'EMOTIF']
        expressions = ['triste', 'colère', 'joie', 'surpris']
        couleurs = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF']
        polices = ['Arial', 'Times New Roman', 'Helvetica', 'Courier']
        tailles = ['PETIT', 'MOYEN', 'GRAND']

        endpages = []
        for i in range(4):
            user = random.choice(users)
            type_choice = types[i % len(types)]
            ton_choice = random.choice(tons)
            expr_choice = random.choice(expressions)

            # Raw “version des faits” text
            raw_version = f"Voici la version des faits numéro {i}, racontée par {user.name}. Le ton est {ton_choice} et l'expression est {expr_choice}."
            # Generate résumé via simple_chat
            resume_prompt = (
                f"résume-moi cette version des faits à la première personne, "
                f"en tant que {expr_choice}:\n\n{raw_version}"
            )
            resumer = simple_chat(resume_prompt)

            # Generate mots d'adieu via simple_chat
            mots_prompt = (
                f"Fais-moi un mot d'adieu à celui qui m'a rendu {expr_choice}, "
                f"en racontant à la première personne et en exprimant clairement mon émotion {expr_choice}:\n\n{raw_version}"
            )
            mots_adieu = simple_chat(mots_prompt)

            # Create EndPage
            endpage = EndPage.objects.create(
                user=user,
                titre=f"Titre fin #{i}",
                version_des_faits=raw_version,
                resumer_des_faits=resumer,
                perpective="Un regard optimiste vers l'avenir.",
                fin_voulue="Je veux trouver une nouvelle voie pleine d'espoir.",
                type=type_choice,
                ton=ton_choice,
                expression=expr_choice,
                identifiant=uuid4(),
                couleur=random.choice(couleurs),
                police=random.choice(polices),
                taille=random.choice(tailles),
                mots_adieu=mots_adieu,
                created_at=timezone.now() - timezone.timedelta(days=random.randint(0, 30)),
                updated_at=timezone.now(),
            )

            # Attach one random “photo” from endpage/images as the main photo
            if available_images:
                photo_path = random.choice(available_images)
                with open(photo_path, "rb") as f:
                    endpage.photo.save(os.path.basename(photo_path), File(f), save=True)

            # 4. Create 1–3 EndPageImage entries
            num_imgs = random.randint(1, 3)
            for _ in range(num_imgs):
                img_path = random.choice(available_images)
                with open(img_path, "rb") as f:
                    EndPageImage.objects.create(
                        end_page=endpage,
                        image=File(f, name=os.path.basename(img_path)),
                    )

            # 5. Create 1–2 EndPageFile entries (using placeholder.pdf)
            num_files = random.randint(1, 2)
            for _ in range(num_files):
                if os.path.exists(placeholder_pdf):
                    with open(placeholder_pdf, "rb") as f:
                        EndPageFile.objects.create(
                            end_page=endpage,
                            fichier=File(f, name="placeholder.pdf"),
                        )

            # 6. Create 1–2 Video entries
            num_vids = random.randint(1, 2)
            for vid_idx in range(num_vids):
                # Choose either an MP3 from endpage/audio or the two MP4s at project root
                if random.choice([True, False]) and available_audio_mp3:
                    audio_path = random.choice(available_audio_mp3)
                else:
                    audio_path = random.choice([video_mp4_1, video_mp4_2])

                with open(audio_path, "rb") as f:
                    Video.objects.create(
                        end_page=endpage,
                        emplacement=f"Emplacement_{vid_idx + 1}",
                        audio_file=File(f, name=os.path.basename(audio_path)),
                        context=f"Contexte audio pour la scène {vid_idx + 1} de l'EndPage #{i}",
                        created_at=timezone.now(),
                    )

            # 7. Create a Scenario linked to the EndPage and the User’s Avatar
            if user.avatar.id is not None:
                avatar = Avatar.objects.get(id=user.avatar.id)
            else:
                avatar,_ = Avatar.objects.get_or_create(user=user)
            print("✅✅  Avatar fetched..")
            scenario = Scenario.objects.create(
                end_page=endpage,
                avatar=avatar,
                context=f"Scénario inspiré de : {raw_version[:60]}…"
            )

            # 8. Create 1–3 Scene entries under this Scenario
            actions = ['ANGRY', 'CRYING', 'SAD', 'HAPPY', 'IDLE', 'REJECTED', 'THANKFUL', 'STAMPING', 'PUNCHING', 'ENUMERATING']
            num_scenes = random.randint(1, 3)
            for sc_idx in range(num_scenes):
                # Generate simple scene text via simple_chat
                scene_prompt = (
                    f"Crée une courte description de scène n°{sc_idx + 1}, "
                    f"dans un ton {ton_choice}, montrant une émotion {expr_choice}, "
                    f"basée sur : {raw_version}"
                )
                scene_text = simple_chat(scene_prompt)
                Scene.objects.create(
                    scenario=scenario,
                    texte=scene_text,
                    action=random.choice(actions),
                    audio_base64=None,  # On peut laisser à None ou générer plus tard
                )

            endpages.append(endpage)

        self.stdout.write(self.style.SUCCESS("4 EndPages (avec Images, Files, Videos, Scenario, Scenes) créés."))

        # 9. Add random reactions from the 6 users
        reaction_fields = [
            "reaction_coeurs",
            "reaction_feux",
            "reaction_larmes",
            "reaction_applaudissements",
            "reaction_sourires",
            "reaction_chocs",
        ]
        for ep in endpages:
            for field in random.sample(reaction_fields, k=2):
                react_field = getattr(ep, field)
                # Each reaction can come from 1-3 random users
                reacting_users = random.sample(users, k=random.randint(1, 3))
                for ru in reacting_users:
                    react_field.add(ru)

        self.stdout.write(self.style.SUCCESS("Réactions aléatoires attribuées."))
        self.stdout.write(self.style.SUCCESS("Seeding terminé avec succès !"))
