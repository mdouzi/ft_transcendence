# Generated by Django 5.1.3 on 2024-12-18 21:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0007_alter_customuser_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='photo',
            field=models.URLField(blank=True, default='https://cdn-images-3.listennotes.com/podcasts/two-dead-pines/lsd-trip-report-Qe0E3pjyGlg-USIahZq6KYe.1400x1400.jpg?_gl=1*2qe68d*_ga*ODMxNDUyOTgxLjE3MzMxNDk5MzY.*_ga_T0PZE2Z7L4*MTczMzE0OTkzNS4xLjAuMTczMzE0OTk0My41Mi4wLjA.', max_length=1000, null=True),
        ),
    ]
