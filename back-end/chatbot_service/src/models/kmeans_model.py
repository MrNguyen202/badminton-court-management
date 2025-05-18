from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import numpy as np

def train_kmeans(features):
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(features)
    kmeans = KMeans(n_clusters=3, random_state=42)
    kmeans.fit(scaled_features)
    return kmeans, scaler

def predict_cluster(kmeans, scaled_data):
    return kmeans.predict(scaled_data)[0]